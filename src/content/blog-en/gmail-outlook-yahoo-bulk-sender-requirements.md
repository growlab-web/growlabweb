---
title: 'Gmail, Outlook and Yahoo bulk sender requirements: a guide to keep your emails out of spam'
slug: gmail-outlook-yahoo-bulk-sender-requirements
translationOf: requisitos-gmail-outlook-yahoo-envios-masivos
description: 'SPF, DKIM, DMARC, one-click unsubscribe and spam rate: what Gmail, Outlook and Yahoo require from bulk email senders and how to comply step by step.'
date: 2026-11-05
category: email-marketing
cover: /images/blog/categorias/en/email-marketing.jpg
coverAlt: 'GrowLab blog cover about email marketing'
author: GrowLab
tags: [email marketing, deliverability, Gmail, DMARC]
---

You can have the best offer and the best design, but if your newsletter lands in the spam folder (or doesn’t arrive at all), nobody will see it. Since 2024, Gmail and Yahoo have required bulk email senders to **authenticate their domain** and make unsubscribing easy; Outlook joined in 2025, and since November 2025 Gmail has stepped up enforcement of these rules.

Many small businesses don’t know these requirements exist until their open rates drop or their emails start bouncing. In this guide we explain what each provider asks for, how to tell whether it affects you and what to check in your domain and your email marketing tool.

## Who does it affect?

Each provider defines “bulk senders” by volume:

- **Gmail:** anyone sending close to **5,000 messages or more within 24 hours** to personal Gmail accounts. Messages from the same primary domain count together, and Google states that senders who reach that figure **even once** are permanently considered bulk senders.
- **Outlook:** domains sending **more than 5,000 emails per day** to its consumer addresses (outlook.com, hotmail.com and live.com).
- **Yahoo:** also distinguishes between all senders and bulk senders, with extra requirements for the latter.

Even if you don’t reach that volume, the basic requirements (such as authenticating with SPF or DKIM) **apply to all senders**. And if you plan to grow, it pays to comply with everything now.

## What each provider requires

| Requirement | Gmail | Yahoo | Outlook |
| --- | --- | --- | --- |
| SPF and DKIM (bulk senders) | Both | Both | Both must pass |
| DMARC | Yes, can be `p=none` | Yes, at least `p=none` and it must pass | Yes, at least `p=none`, aligned with SPF or DKIM |
| One-click unsubscribe | Required for marketing emails | Required (List-Unsubscribe header) | Recommended: visible unsubscribe link |
| Processing unsubscribes | Recommends within 48 hours | Within 2 days | — |
| Spam rate | Below 0.3% (ideally below 0.1%) | Below 0.3% | — |

Gmail also asks all senders for valid forward and reverse DNS (PTR) records, a **TLS** connection, messages in standard format and not impersonating @gmail.com addresses in the From header.

## The three records you should check

### SPF

A record in your domain’s DNS that states **which servers may send email on your behalf**. If you use Google Workspace for everyday email and a tool such as Mailchimp, Brevo or Klaviyo for campaigns, both must be authorized.

### DKIM

Adds a **digital signature** to each message to prove it wasn’t altered and that it came from your domain. Your email marketing platform gives you the records to copy into your DNS. Gmail requires a DKIM key of **1024 bits or longer**.

### DMARC

Tells Gmail, Outlook or Yahoo **what to do if an email fails** SPF and DKIM, and sends you reports. To comply, starting with a `p=none` policy (monitoring only) is enough, but the From domain your customer sees must be **aligned** with the SPF or DKIM domain. That is why your campaigns should go out from your own domain (for example, `news@yourbrand.com`) and not from the tool’s generic domain.

## What happens if you don’t comply

- **Gmail:** according to its official FAQ, messages that fail the requirements “will experience disruptions,” which can include **temporary and permanent rejections** or delivery to spam. Since **November 2025**, Gmail has been ramping up enforcement on non-compliant traffic. Also, since June 2024, bulk senders with a user-reported spam rate above 0.3% are ineligible for mitigation.
- **Outlook:** since **May 5, 2025**, non-compliant mail from high-volume senders is routed to the **Junk** folder. Microsoft has announced that it will later reject it, on a date still to be announced, with the error `550; 5.7.515`.
- **Yahoo:** applies its requirements to all senders and asks more of bulk senders; if you fail them, your emails may not reach the inbox.

## Checklist for your brand

1. **Send from your own domain**, never from a free address (@gmail.com, @hotmail.com) for campaigns.
2. **Set up SPF, DKIM and DMARC** with the details provided by your email platform and your mail provider. If you don’t know where your DNS is, it is usually wherever you bought the domain.
3. **Enable one-click unsubscribe** (List-Unsubscribe header) in your tool and also keep a visible unsubscribe link in the email footer.
4. **Process unsubscribes in under 48 hours**; professional tools do it instantly.
5. **Only email contacts who gave consent.** Bought lists trigger spam complaints and, in many countries, processing personal data without consent has legal implications (see, for example, [Peru’s new data protection regulation](/en/blog/peru-data-protection-regulation-marketing)).
6. **Clean your list** of invalid or inactive addresses to reduce bounces.
7. **Track your spam rate** in Google Postmaster Tools and keep it below 0.1%.

The same principle of consent and quality applies to other channels: it is also what protects your [WhatsApp Business number from bans](/en/blog/whatsapp-business-account-bans).

## In summary

Gmail, Outlook and Yahoo no longer just recommend but **require** authentication (SPF, DKIM and DMARC), easy unsubscribing and few spam complaints from bulk email senders. Checking your domain and your tool takes little time and is the foundation for your email campaigns to reach the inbox and sell.

**Sources:** [Google: email sender guidelines](https://support.google.com/a/answer/81126?hl=en) · [Google: email sender guidelines FAQ](https://support.google.com/a/answer/14229414?hl=en) · [Microsoft: Outlook’s new requirements for high-volume senders](https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730) · [Yahoo Sender Hub: best practices and requirements](https://senders.yahooinc.com/best-practices/)
