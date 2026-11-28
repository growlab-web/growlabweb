---
title: 'Google tag and Tag Manager are merging: what changes in your tracking and what to check'
slug: google-tag-tag-manager-unification
translationOf: google-tag-manager-unificacion-google-tag
description: 'Every Google tag becomes a Tag Manager container. What it means for GA4 and Google Ads, which setups get upgraded in January 2027 and what to check now.'
date: 2026-11-28
category: tracking-analitica
cover: /images/blog/categorias/en/tracking-analitica.jpg
coverAlt: 'GrowLab blog cover about tracking and analytics'
author: GrowLab
tags: [Google Tag Manager, Google tag, GA4, Google Ads, tracking]
---

If your website measures visits with Google Analytics 4 or conversions with Google Ads, it almost certainly uses the **Google tag** (gtag.js), **Google Tag Manager** (GTM) or both. Until now they were two separate tools with different settings and permissions, and that caused plenty of headaches: duplicated data, tags that didn’t fire, or nobody knowing who changed what.

On November 17, 2026, Google confirmed in the Tag Manager release notes that **every Google tag becomes a Tag Manager container**. Here is what that means, what changes (and what doesn’t) and what you should check before January 2027.

## What Google announced

Google sums it up like this: it is bringing **all the capabilities of Google Tag Manager to the Google tag**. In practice:

- **Every Google tag becomes a Tag Manager container.** If your site only uses the Google tag, it can now use GTM’s interface-driven tagging, debugging and **version control**.
- **The in-page behavior doesn’t change.** Google says the upgrade won’t change how the tags behave on the page; it only gives you the option to use Tag Manager features.
- **Each Google destination has its own tag** (GA4, Google Ads, Floodlight or Merchant Center), and your existing setup and triggers for automatic events are preserved.
- **All new deployment snippets will be the same** and won’t include the `gtag('config')` command. Google recommends configuring initialization with Tag Manager’s standard initialization triggers.
- **Tag Manager permissions apply across the board**: access to Tag Assistant data will be managed through the same container permissions.

This step completes a series of changes Google announced on August 20, 2026, together with a simpler interface (a centralized **Settings** tab and an **Advanced** section with triggers, variables, templates and folders) and **visual tagging**, which lets you create events by selecting elements on your site without coding. According to Google, visual tagging is in beta for purchase conversions in Google Ads and will be rolled out progressively to other use cases.

## Earlier changes you should know about

The merger follows other technical adjustments over the past few months:

| Date | Change | What it means for you |
| --- | --- | --- |
| July 9, 2026 | The container ID defines what can run | A `GTM-` ID allows all tag types (including custom HTML); a `G-` or `AW-` ID only allows Google tags |
| October 8, 2026 | GTM snippets initialize on load, without waiting for `gtag('config')` | `config` commands show up in the data layer as `gtag.config` events and can fire tags that use wildcard custom event triggers |
| October 12, 2026 | Containers send data directly to GA4 and Google Ads | The extra gtag.js script is no longer loaded: less latency and clearer diagnostics |
| November 17, 2026 | Every Google tag becomes a Tag Manager container | GTM’s interface, versions and permissions also for sites that only used the Google tag |

## Is your installation “unsupported”?

This is the point most worth checking. Google considers it **unsupported** to load an ID that doesn’t start with `GTM-` (for example `G-`, `AW-` or `DC-`) through the Tag Manager snippet (gtm.js), or to use the GTM snippet together with `gtag('config')` commands for those IDs. It is common on sites built by copying code from several places.

Google says unsupported installations **will receive the upgrade in January 2027** and advises fixing them before then. It also said users of affected containers were notified by email, so check the inbox of the account you use to manage Tag Manager.

Google’s fix is simple: if you want to keep using `gtag('config')` for GA4 or Google Ads, use the **standard Google tag (gtag.js) snippet** on every page. If you manage everything from Tag Manager instead, keep only the GTM snippet and set up your tags there.

## Container optimization: recommended, not mandatory

If you already use Tag Manager, you’ll see a prompt to **“Optimize your Tag Manager container”**. This process moves your Google tag settings into the new Settings tab and makes the container send data directly to each destination. What you should know:

- Google says **no changes are made automatically**: you decide whether to adopt it.
- You need edit, approve or publish permissions on the container.
- **Your event tags and triggers are kept.** You can preview the changes, test them in Preview mode and roll back to an earlier version if something breaks.
- When you optimize, the container is linked to your Google accounts (GA4, Google Ads) and **Read** access is granted by default, which you can adjust in user management.
- If you have several Google tags with different settings, the guided flow will ask you to choose which ones to keep.

## Checklist to review your tracking

1. **Find out how your site is installed**: look in the code for `gtm.js`, `gtag/js` or both, and which ID each one uses.
2. **Fix unsupported combinations**: a `G-` or `AW-` ID loaded with the GTM snippet, or `gtag('config')` next to the GTM snippet.
3. **Review wildcard custom event triggers** in GTM: since October they can fire on the new `gtag.config` events.
4. **Avoid double counting**: if GA4 is installed in the code and also through GTM, keep only one.
5. **Clean up container permissions**: they now also control access to Tag Assistant.
6. **Run the optimization in a test workspace** and validate it in Preview mode and in GA4’s real-time reports before publishing.
7. **Document every version**: Tag Manager now suggests an AI-generated version name and description when you publish; use it as a starting point.

If you also send data from your server, our article on [Stape and server-side tracking](/en/blog/stape-server-side-tracking) explains how it fits with Tag Manager. And if your numbers don’t match across platforms, read about [attribution windows in GA4, Meta and Google Ads](/en/blog/attribution-windows-ga4-meta-google-ads).

## In summary

Google tag and Tag Manager are becoming a single platform: every Google tag is now a container with GTM’s interface, versions and permissions, without changing how your site measures. The urgent part is checking whether your installation mixes snippets in an unsupported way, because those sites will be upgraded in January 2027. The recommended part, when you have time, is optimizing your container and using the moment to remove duplicated tags.

**Sources:** [Google Tag Manager release notes](https://support.google.com/tagmanager/answer/4620708?hl=en) · [Google: updates to Google tag and Google Tag Manager (August 20, 2026)](https://support.google.com/tagmanager/answer/17079602?hl=en) · [Google: set up your Google tag installation correctly for gtag.js](https://support.google.com/tagmanager/answer/17231523?hl=en) · [Google: optimize your Google Tag Manager container](https://support.google.com/tagmanager/answer/16659369?hl=en) · [Google: manage tagging behavior using the container ID](https://support.google.com/tagmanager/answer/17070049?hl=en) · [Search Engine Roundtable: Google tag and Google Tag Manager unification](https://seroundtable.com/google-tag-manager-unification-42562.html)
