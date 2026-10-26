---
title: 'Attribution windows: why GA4 does not show the same conversions as Meta and Google Ads'
slug: attribution-windows-ga4-meta-google-ads
translationOf: ventanas-atribucion-ga4-meta-google-ads
description: 'Meta, Google Ads and GA4 almost never agree on conversions. What attribution windows are, which ones each platform uses and how to read your numbers correctly.'
date: 2026-10-20
category: tracking-analitica
cover: /images/blog/en/attribution-windows-ga4-meta-google-ads.jpg
coverAlt: 'GrowLab blog cover about tracking and analytics'
author: GrowLab
tags: [GA4, Meta Ads, Google Ads, attribution, analytics]
---

It is one of the questions we get asked most: *“Meta says I sold 40, Google Ads says 35 and GA4 says 28. Which is the real number?”* The short answer: **no platform is “wrong”**. Each one measures with different rules, and the most important one is the **attribution window**.

## What an attribution window is

It is the **period during which a platform takes credit for a conversion** after someone interacted with an ad. If the window is 7 days after the click and the person buys on day 5, the platform counts that sale as its own. If they buy on day 10, it does not.

There are two types of interaction:

- **Click:** the person clicked the ad.
- **View:** the person saw the ad but did not click.

## Each platform’s windows

| Platform | Available windows | Common setting |
| --- | --- | --- |
| **Meta Ads** | 1, 7 or 28 days after a click; 1 day after a view; 1 day after an engaged video view | 7 days after a click and 1 day after a view |
| **Google Ads** | Click: 1 to 90 days depending on the campaign; engaged view: up to 30 days; view: up to 30 days | 30 days after a click, 3 days after an engaged view, 1 day after a view |
| **GA4** | Acquisition events: 7 or 30 days; other key events: 30, 60 or 90 days | 30 days (acquisition) and 90 days (others) |

**What’s new at Meta in 2026:** since **January 12, 2026**, Meta’s Ads Insights API **no longer returns data for the 7-day and 28-day view-through windows**. If your external reports (Looker Studio, spreadsheets, connectors) requested those windows, they now receive empty data and should be reviewed.

## Why the numbers don’t match

### 1. Each platform takes credit for the sale

If a person clicks a Meta ad, a few days later searches for your brand on Google, clicks a Google Ads ad and buys, **Meta and Google Ads both count the same sale**. GA4, on the other hand, sees the full journey on your website and splits the credit between channels: one sale, one record.

### 2. Views

Meta and Google Ads can count conversions from people who **only saw** an ad. GA4 is based on **visits to your website**: if someone saw the ad and later arrived by typing your address, GA4 records it as direct traffic, not as Meta.

### 3. The date of the conversion

By default, Google Ads assigns the conversion **to the day of the click**; GA4 records it **on the day it happened**. If someone clicked on Monday and bought on Friday, Google Ads shows it on Monday and GA4 on Friday. That is why day-by-day comparisons almost never add up.

### 4. GA4’s attribution models

GA4 offers the **data-driven** model and the **last click** model. The first click, linear, time decay and position-based models **were retired in November 2023**. If someone compares against an old report built with those models, the figures will not be comparable.

### 5. Data lost in the browser

Ad blockers, cookies the browser deletes early (Safari limits cookies created with JavaScript to 7 days) and visitors who reject cookies mean GA4 and the pixels see fewer conversions than actually happened. Ad platforms make up for part of this with **modeled conversions**; GA4 only does so in certain cases.

## How to read your numbers correctly

1. **Define a source of truth for each question.** To know how much you sold: your store or your CRM. To optimize campaigns: each platform. To compare channels with each other: GA4.
2. **Compare with the same rules.** If you compare Meta with GA4, use similar windows and complete periods (a week or a month), not single days.
3. **Use UTM parameters on all your ads.** Without them, GA4 cannot properly identify where each visit comes from.
4. **Send conversions from the server.** The [Meta Conversions API](/en/blog/meta-pixel-conversions-api) and server-side tagging recover part of the data lost in the browser.
5. **Review your automated reports** if they used Meta’s 7-day or 28-day view-through windows.

## In summary

It is normal for Meta, Google Ads and GA4 not to match: they measure with different windows, models and dates, and each platform takes credit for the sales it was involved in. What matters is not that the numbers are identical, but understanding what each one measures and using the right one for each decision.

**Sources:** [Meta for Developers: Ads Insights API metric availability updates (10/16/2025)](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) · [Google Ads Help: conversion windows](https://support.google.com/google-ads/answer/3123169) · [Google Analytics Help: attribution settings](https://support.google.com/analytics/answer/10597962) · [WebKit: Intelligent Tracking Prevention 2.1](https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/)
