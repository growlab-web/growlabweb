<?php
/**
 * Recibe el formulario de contacto de growlab.pe (hosting cPanel, PHP).
 *  1) valida los datos           2) guarda el lead en un CSV fuera de la carpeta pública
 *  3) envía el aviso por correo  4) responde en JSON: { ok: true } o { ok: false, error: "..." }
 *
 * Para que el correo llegue a la bandeja de entrada (y no a spam), la dirección FROM tiene que ser del propio dominio:
 * crea la cuenta web@growlab.pe en cPanel (Cuentas de correo) y revisa en «Email Deliverability» que SPF y DKIM estén en verde.
 */

const TO        = 'hola.grow.lab@gmail.com';      // adónde llegan los leads
const FROM      = 'web@growlab.pe';               // remitente técnico (del dominio)
const FROM_NAME = 'Web GrowLab';
const MAX_PER_HOUR = 6;                           // envíos permitidos por visitante y hora (freno básico al spam)

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}
// texto de una sola línea, sin saltos (evita que se cuelen cabeceras de correo) y con un largo máximo
function line($value, int $max): string {
    $text = is_string($value) ? $value : '';
    $text = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $text) ?? '');
    return function_exists('mb_substr') ? mb_substr($text, 0, $max) : substr($text, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Método no permitido.']);
}

// sólo se aceptan envíos hechos desde el propio sitio
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST) ?: '';
    $selfHost   = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (strcasecmp(preg_replace('/^www\./i', '', $originHost), preg_replace('/^www\./i', '', $selfHost)) !== 0) {
        respond(403, ['ok' => false, 'error' => 'Origen no permitido.']);
    }
}

// campo trampa: las personas no lo ven; si viene relleno es un robot (se le responde «ok» para que no insista)
if (line($_POST['website'] ?? '', 200) !== '') {
    respond(200, ['ok' => true]);
}

$nombre   = line($_POST['nombre'] ?? '', 120);
$email    = line($_POST['email'] ?? '', 160);
$telefono = line($_POST['telefono'] ?? '', 40);
$mensaje  = is_string($_POST['mensaje'] ?? null) ? trim($_POST['mensaje']) : '';
$mensaje  = function_exists('mb_substr') ? mb_substr($mensaje, 0, 4000) : substr($mensaje, 0, 4000);
$consent  = !empty($_POST['consent']);
$pagina   = line($_POST['pagina'] ?? '', 300);

$servicios = $_POST['servicios'] ?? [];
if (!is_array($servicios)) { $servicios = [$servicios]; }
$servicios = array_values(array_filter(array_map(function ($s) { return line($s, 80); }, array_slice($servicios, 0, 20))));

if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'Completa tu nombre, un correo válido y el mensaje.']);
}
if (!$consent) {
    respond(422, ['ok' => false, 'error' => 'Para enviar el mensaje debes aceptar que se recopilen tus datos.']);
}

// carpeta de datos FUERA de public_html: no se puede abrir desde el navegador
$dataDir = dirname(rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/')) . '/growlab-leads';
$canStore = is_dir($dataDir) || @mkdir($dataDir, 0700, true);

// freno al spam: máximo de envíos por visitante y hora
if ($canStore) {
    $ipKey    = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'x') . '|growlab');
    $rateFile = $dataDir . '/rate-' . substr($ipKey, 0, 24) . '.json';
    $now      = time();
    $hits     = [];
    if (is_file($rateFile)) {
        $saved = json_decode((string) @file_get_contents($rateFile), true);
        if (is_array($saved)) { $hits = array_values(array_filter($saved, function ($t) use ($now) { return is_int($t) && $t > $now - 3600; })); }
    }
    if (count($hits) >= MAX_PER_HOUR) {
        respond(429, ['ok' => false, 'error' => 'Has enviado varios mensajes seguidos. Inténtalo de nuevo más tarde o escríbenos a ' . TO . '.']);
    }
    $hits[] = $now;
    @file_put_contents($rateFile, json_encode($hits), LOCK_EX);
}

$fecha = date('Y-m-d H:i:s');
$lista = $servicios ? implode(', ', $servicios) : '-';

// 1) el lead se guarda antes de enviar el correo: si el correo fallara, el dato no se pierde
$stored = false;
if ($canStore) {
    $csv   = $dataDir . '/leads.csv';
    $isNew = !is_file($csv);
    $fh    = @fopen($csv, 'a');
    if ($fh) {
        if (flock($fh, LOCK_EX)) {
            if ($isNew) {
                fwrite($fh, "\xEF\xBB\xBF");      // marca UTF-8 para que Excel muestre bien las tildes
                fputcsv($fh, ['fecha', 'nombre', 'email', 'telefono', 'servicios', 'mensaje', 'pagina']);
            }
            // un valor que empieza por = + - @ se guarda como texto, para que la hoja de cálculo no lo ejecute como fórmula
            $safe = function ($v) { return preg_match('/^[=+\-@]/', $v) ? "'" . $v : $v; };
            fputcsv($fh, array_map($safe, [$fecha, $nombre, $email, $telefono, $lista, $mensaje, $pagina]));
            $stored = true;
            flock($fh, LOCK_UN);
        }
        fclose($fh);
    }
}

// 2) aviso por correo
$subject = $servicios ? 'Nuevo lead: ' . $lista . ' · ' . $nombre : 'Nuevo contacto: ' . $nombre;
$body = implode("\n", [
    'Nombre: ' . $nombre,
    'Correo: ' . $email,
    'Teléfono: ' . ($telefono !== '' ? $telefono : '-'),
    'Servicios de interés: ' . $lista,
    '',
    $mensaje,
    '',
    '--',
    'Enviado desde ' . ($pagina !== '' ? $pagina : 'growlab.pe') . ' el ' . $fecha,
]);
$encode  = function ($text) { return '=?UTF-8?B?' . base64_encode($text) . '?='; };
$headers = implode("\r\n", [
    'From: ' . $encode(FROM_NAME) . ' <' . FROM . '>',
    'Reply-To: ' . $encode($nombre) . ' <' . $email . '>',     // al responder el correo, la respuesta va al visitante
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$sent = @mail(TO, $encode($subject), $body, $headers, '-f' . FROM);

if (!$sent && !$stored) {
    respond(500, ['ok' => false, 'error' => 'No pudimos enviar tu mensaje. Escríbenos directamente a ' . TO . '.']);
}
respond(200, ['ok' => true]);
