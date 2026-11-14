---
title: 'ChatGPT and AI traffic in GA4: how to see it with the AI Assistant channel'
slug: ai-chatbot-traffic-ga4
translationOf: trafico-ia-chatgpt-ga4
description: 'GA4 now separates visits from ChatGPT, Gemini and other AI tools into the AI Assistant channel. Here’s how to see them, what’s missing and how to fill the gaps.'
date: 2026-11-14
category: tracking-analitica
cover: /images/blog/categorias/en/tracking-analitica.jpg
coverAlt: 'GrowLab blog cover about tracking and analytics'
author: GrowLab
tags: [GA4, Google Analytics, ChatGPT, AI search, channels]
---

More and more people ask ChatGPT, Gemini or Copilot which product to buy or which agency to hire, and some of them end up clicking through to your website. Until recently, Google Analytics 4 mixed those visits in with the rest of your **Referral** traffic, and you had to build a custom channel to separate them.

Since **May 13, 2026**, GA4 does it for you: it added an **AI Assistant** channel to its default channel group. This guide explains where to find it, which traffic it includes (and which it doesn’t) and how to extend it so you can better measure AI’s impact on your business.

## What the AI Assistant channel is

According to Google Analytics’ “What’s new” page, GA4 now measures traffic from AI assistants such as **ChatGPT, Gemini or Claude** in a channel of its own. You don’t need to configure anything: the change applies automatically to every property.

When a visit’s referrer matches a recognized AI assistant, GA4 changes three values:

| Dimension | Value GA4 assigns |
| --- | --- |
| Medium | `ai-assistant` |
| Campaign | `(ai-assistant)` |
| Default channel group | AI Assistant |

In its default channel group documentation, Google gives **ChatGPT, Gemini, DeepSeek, Copilot and Grok** as examples, but it does not publish the full list of recognized assistants. It provides a spreadsheet of the sources and categories GA4 uses and lets you request new additions.

## Where to see it in your reports

1. Go to **Reports › Acquisition › Traffic acquisition**.
2. Make sure the primary dimension is **Session default channel group**.
3. Look for the **AI Assistant** row.
4. To see which assistant sends the most visits, switch the dimension to **Session source / medium** and filter by the `ai-assistant` medium.
5. Add your key events (form submissions, purchases, WhatsApp clicks) to see whether that traffic doesn’t just arrive but also **converts**.

A tip: compare the AI Assistant channel with **Organic Search** over the same period. Visits from AI tools are usually few, but people arrive with a specific recommendation in mind, so it’s worth checking their conversion rate and not just the volume.

## What this channel does not measure

The channel is useful, but it does not capture all AI-related traffic. Keep this in mind before drawing conclusions:

- **Visits without a referrer:** according to Search Engine Journal, AI assistant traffic that arrives without a referrer header still shows up as **Direct**. This happens, for example, with in-app browsers, mobile apps or copied-and-pasted links.
- **Google’s own AI features:** Google’s documentation states that **AI Overviews** and **AI Mode** are not part of this channel. That traffic is still counted within Google Search. To learn how to adapt your site to that shift, read our article on [Google’s AI Mode and SEO](/en/blog/google-ai-mode-peru-seo).
- **Unrecognized assistants:** if an AI tool is not on Google’s list, its visits will stay in **Referral** until GA4 adds it.
- **Mentions without a click:** an AI tool recommending your brand without the person clicking leaves no trace in GA4.

## How to extend it with a custom channel

If you want to control exactly which sources count as AI (for example, to include an assistant GA4 doesn’t recognize yet), you can create a **custom channel group**:

1. Go to **Admin › Data display › Channel groups**.
2. Create a new group by **copying the default group**.
3. Add a channel (for example, “AI”) with the condition that the session source matches the domains of the assistants you care about.
4. **Reorder the channels:** GA4 assigns each visit to the first channel whose conditions it matches, so your AI channel must come **before Referral**.
5. Save the group and use it as a dimension in Traffic acquisition or in Explorations.

Keep the limits in mind: a standard property allows **2 custom channel groups** (5 in GA4 360), with up to **50 channels** each. You need **Editor** access or higher, and the upside is that these groups **also apply to historical data**.

## What to do with this data

- **Review the landing pages** for AI traffic: they tell you which content assistants cite and which questions your site answers.
- **Measure conversions, not just visits.** Mark what really matters as a key event (forms, purchases, WhatsApp clicks).
- **Don’t compare numbers without context:** ad platforms and GA4 attribute differently. If that’s your case, read our guide to [attribution windows in GA4, Meta and Google Ads](/en/blog/attribution-windows-ga4-meta-google-ads).
- **Check the trend monthly**, not daily: with low volumes, a couple of visits can swing the percentages a lot.

## In summary

GA4’s AI Assistant channel shows you, with no setup, how many visits come from ChatGPT, Gemini and other AI assistants, and whether they convert. It doesn’t measure everything: traffic without a referrer stays in Direct, and Google’s own AI features remain within organic search. Use it as a starting point and, if you need more control, extend it with a custom channel group.

**Sources:** [What’s new in Google Analytics (May 13, 2026)](https://support.google.com/analytics/answer/9164320?hl=en) · [Analytics Help: default channel group](https://support.google.com/analytics/answer/9756891?hl=en) · [Analytics Help: custom channel groups](https://support.google.com/analytics/answer/13051316?hl=en) · [Search Engine Journal: Google Analytics adds AI Assistant channel](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/)
