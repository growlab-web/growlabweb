---
title: 'Search Console and Google’s AI: how to see your AI Overviews impressions and whether to opt out'
slug: search-console-generative-ai-report-control
translationOf: search-console-ia-generativa-informe-control
description: 'Search Console now shows your impressions in AI Overviews and AI Mode, and lets you exclude your site. What the report measures and when opting out makes sense.'
date: 2026-11-25
category: seo
cover: /images/blog/categorias/en/seo.jpg
coverAlt: 'GrowLab blog cover about SEO'
author: GrowLab
tags: [Search Console, AI Overviews, AI Mode, SEO]
---

Until recently, knowing whether your site showed up in Google’s AI answers was mostly guesswork: you searched your keywords by hand and looked for your link. That has changed. Google Search Console now has a **generative AI performance report** and a **toggle to exclude your site** from AI Overviews, AI Mode and the generative AI features in Discover.

Both tools were announced on **June 3, 2026** and, according to Google, have been available to all websites worldwide since **August 31, 2026**. In this guide we explain what the report measures, how to read it and why, for most businesses, opting out of Google’s AI is not a good idea.

## What Google announced

Google introduced two things at once:

- **Generative AI performance reports**: one for Search (AI Overviews and AI Mode) and one for Discover. They show how many times your site was shown in those features.
- **A settings control** to decide whether your site appears in Search’s generative AI features and whether its content is used to ground those answers.

Context matters: Google says it is working with regulators such as the **UK’s Competition and Markets Authority (CMA)**, which on the same day set a requirement allowing sites to opt out of these features without being penalized in regular results. Google puts AI Overviews at **more than 2.5 billion monthly users** and AI Mode at **more than 1 billion**, so this is no minor shop window.

## How to find the report and what it shows

Open Search Console and look under **Performance** for the Search generative AI report. If your site has not yet had enough impressions in these features, Google warns that **the report may not appear**.

| What it offers | Details |
| --- | --- |
| Metric | **Impressions** only: how many times links to your site were shown in an AI feature |
| Features covered | AI Overviews and AI Mode (Search Labs experiments are excluded) |
| Breakdowns | Pages, countries, dates and devices |
| Search type | Regular text or multimodal (Google Lens, Circle to Search, image search) |
| What it lacks | **Clicks** and queries |

Two details to read it correctly:

- If your site appears several times in the same AI answer, **it counts as a single impression**. That is why chart totals and per-page table totals may not match.
- These impressions are **also included in the overall performance report**. The new report adds no extra traffic: it lets you isolate the part that comes from AI.

### Questions it helps you answer

1. **Which pages does Google use in its AI answers?** They are usually guides, FAQs and pages that explain something clearly.
2. **In which countries?** Useful if you sell across borders or serve several markets.
3. **On which devices?** If it is almost all mobile, check how that page looks and loads on a phone.
4. **Did anything change after an update?** Compare the weeks before and after, for example around the [November core update](/en/blog/november-2026-core-update-ai-content).

Because the report has no clicks, cross-check it with Google Analytics 4: traffic that arrives from Google still shows up as organic search, and traffic from chatbots such as ChatGPT can be seen with the [GA4 AI Assistant channel](/en/blog/ai-chatbot-traffic-ga4).

## The toggle to opt out of Google’s AI

It lives under **Settings > Search generative AI**, and only property **owners** can change it. There are three options: **include** your site (the default), **exclude** it or, for child properties, **inherit** the parent property’s setting.

What it does and doesn’t do, according to Google’s help center:

| If you exclude your site… | Details |
| --- | --- |
| You leave | AI Overviews, AI Mode and Discover’s generative AI features |
| You lose | All traffic and impressions from those features |
| It doesn’t affect | Your rankings in regular results: Google says it **is not a ranking signal** |
| It doesn’t affect | Your choices in Merchant Center and Google Ads |
| It doesn’t control | Use of your content to **train** AI models (that is handled with Google-Extended) |
| It isn’t for | Removing your site from Google entirely (that is what `noindex` is for) |
| Timing | Changes usually take a few days; content should be excluded within 1–2 days after the change goes live |

Google also notes that even if you opt out, **other sites’ content can still appear** and may look similar to yours. In other words, opting out does not stop the AI from answering about your topic: it only removes you from the answer.

## Should you opt out? Almost always, no

For a small business, an online store or a service company, showing up in an AI answer is free visibility at the exact moment someone is researching what to buy or whom to hire. Opting out means giving up those impressions without gaining positions in regular results.

It may be worth considering if:

- Your business **sells the content itself** (a subscription publication, courses, paid reports) and you worry about AI summarizing it.
- You have data showing those impressions **don’t bring you customers** and you prefer people to land directly on your site.

Even then, Google recommends **checking the report first** to see what is at stake. And if your concern is AI model training, remember this toggle does not control it.

## Checklist for this week

1. Open Search Console and check whether you can already see the generative AI report.
2. Write down your **top 10 pages by AI impressions** and the countries they come from.
3. Improve those pages: original information (prices, experience, cases), a clear structure with subheadings and good images, which is what Google asks for in its guidance for these features.
4. Confirm under **Settings** that your site is still set to “include” and review who has owner access.
5. Each month, compare AI impressions with organic traffic and conversions in GA4.

## In summary

Search Console now tells you how many times you appear in AI Overviews and AI Mode, by page, country and device, although still without clicks. It also lets you opt out of those features, but that does not improve your regular rankings and it takes visibility away. For most businesses, the smart move is to use the report to understand which content Google’s AI values and strengthen it.

**Sources:** [Google: New opportunities, control and insights for website owners](https://blog.google/products-and-platforms/products/search/new-opportunities-control-and-insights-for-website-owners/) · [Google Search Central: generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) · [Search Console Help: Search generative AI control](https://support.google.com/webmasters/answer/16908024) · [Search Console Help: generative AI performance report](https://support.google.com/webmasters/answer/16984139) · [Search Engine Journal: Search Console AI reports rolled out worldwide](https://www.searchenginejournal.com/google-search-console-ai-reports-rolled-out-worldwide/587836)
