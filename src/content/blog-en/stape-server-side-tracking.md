---
title: 'Stape and server-side tracking: why it matters and when it makes sense'
slug: stape-server-side-tracking
translationOf: stape-tracking-server-side
description: 'Ad blockers, expiring cookies and lost data: how server-side tagging with Stape helps, how much it costs and what to consider before using it.'
date: 2026-10-22
category: tracking-analitica
cover: /images/blog/en/stape-server-side-tracking.jpg
coverAlt: 'GrowLab blog cover about tracking and analytics'
author: GrowLab
tags: [Stape, server-side, Google Tag Manager, Conversions API, tracking]
---

More and more data is lost in the browser: ad blockers, browsers that delete cookies early and scripts that never load. The result is campaigns optimizing with incomplete information. **Server-side tagging** is today one of the most effective ways to recover that data quality, and **Stape** is one of the most widely used platforms to implement it.

## What server-side tagging is

In traditional measurement, the visitor’s browser sends data directly to each platform: GA4, Meta, Google Ads, TikTok. With server-side tagging, the browser sends the events **to a server of your own**, and from there they are distributed to each platform.

Google Tag Manager has a container type designed for this, the **server container**. As Google explains, with it **only you have access to the data on the server until you decide to send it elsewhere**, and you control its shape and where it goes.

## What Stape is

Google Tag Manager’s server container needs a server to run on. You can set it up on Google Cloud, but it requires technical configuration and maintenance. **Stape is a service that hosts that container for you**: you create it in minutes and Stape takes care of the infrastructure.

Beyond hosting, Stape offers tools designed to improve data quality:

- **Your own subdomain** (for example, `data.yourbrand.com`): requests come from your own domain and cookies are created as first-party cookies.
- **A custom loader** for Google Tag Manager and GA4, more resistant to ad blockers.
- **Cookie Keeper**, which helps preserve cookies in browsers with tracking prevention, such as Safari.
- **Connections** to platforms such as Meta, Google Ads or TikTok from the same server.

## Why it matters

### 1. Cookies that last as long as they should

Safari limits cookies created with JavaScript to **7 days**. If a customer comes back to buy on day 10, to GA4 or the pixel they look like a new visitor. Cookies created from your own properly configured server can last much longer, which improves attribution. Safari also watches certain subdomains that point to external servers, which is why configuration matters, and tools like Cookie Keeper exist precisely for that.

### 2. Less blocked data

Many blockers prevent tracking scripts from loading from well-known domains. By serving measurement from your own subdomain, you recover part of that data.

### 3. Better signals for your campaigns

From the server you can send events to the **Meta Conversions API**, Google Ads conversions or TikTok with more information and more reliably. More recorded conversions mean the algorithms learn better. If you use the pixel and the API at the same time, remember to [deduplicate events](/en/blog/meta-pixel-conversions-api).

### 4. Control over your data

Before sending an event you can **remove or anonymize personal data**, decide what each platform receives and better comply with data protection rules.

## How much it costs

Stape charges based on the number of requests per month. The prices published on its website, billed annually, are:

| Plan | Requests per month | Price |
| --- | --- | --- |
| Free | Up to 10,000 | Free |
| Pro | Up to 500,000 | US$17/month |
| Business | Up to 5 million | US$83/month |
| Enterprise | Up to 20 million | US$167/month |

Billed monthly, the paid plans cost US$20, US$100 and US$200 per month respectively. For many small businesses the Pro plan is enough; a high-traffic store may need Business.

## What server-side does not do

- **It does not replace consent.** If a visitor rejects measurement cookies, that choice must also be respected on the server. In Peru, Law 29733 and its [new regulation](/en/blog/peru-data-protection-regulation-marketing) apply.
- **It does not work on its own.** You need to configure the container, clients, tags and deduplication. A half-done implementation can duplicate conversions or lose data.
- **It is not essential for everyone.** If your ad spend is small or your website gets little traffic, first make sure your basic measurement is solid.

## In summary

Server-side tagging with Stape recovers data that is currently lost in the browser, extends cookie lifetimes, delivers better signals to Meta and Google Ads and gives you control over what you share. It is especially valuable for online stores and businesses with ongoing ad spend, as long as it is implemented well and respects your visitors’ consent.

**Sources:** [Google: introduction to server-side tagging](https://developers.google.com/tag-platform/tag-manager/server-side/intro) · [Stape: pricing](https://stape.io/price) · [Stape: what is server-side tracking](https://stape.io/blog/what-is-server-side-tracking) · [WebKit: Intelligent Tracking Prevention 2.1](https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/)
