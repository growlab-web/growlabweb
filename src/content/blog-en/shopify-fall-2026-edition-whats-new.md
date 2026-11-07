---
title: 'Shopify Fall 2026 Edition: the updates that actually matter to your store'
slug: shopify-fall-2026-edition-whats-new
translationOf: shopify-editions-fall-2026
description: 'AI agents, a rebuilt Sidekick, Canvas and the end of script tags: what Shopify’s Fall 2026 Edition brings and what to check in your store.'
date: 2026-11-07
category: ecommerce-web
cover: /images/blog/categorias/en/ecommerce-web.jpg
coverAlt: 'GrowLab blog cover about ecommerce and websites'
author: GrowLab
tags: [Shopify, Shopify Editions, ecommerce, AI, Sidekick]
---

Twice a year, Shopify bundles its product news into its **Editions**. The Fall 2026 release, which the company titled *“Exponential,”* was published on **October 28, 2026** and, as expected, revolves around artificial intelligence: agents that shop on the customer’s behalf, an assistant that does technical work and a new way to edit your store by chatting.

There are a lot of announcements, and not all of them apply to every store. In this article we separate what is worth knowing, what is still at an early stage and one technical change with a deadline that may affect the apps in your store.

## AI as a sales and management channel

### Your catalog, visible to AI agents

Shopify argues that more and more purchases start in a conversation with an AI assistant. To support that, it introduced **Shop.md**, a shopping “skill” that any agent (such as ChatGPT or Claude) can use to **search over a billion products, check out with Shop Pay and track orders**.

The most practical piece for you is the new **Knowledge base** page (under *Sales channels > Agentic*). There you review and publish the store facts that agents will see: **return windows, shipping destinations or gift services**. Shopify drafts those facts and suggests updates, but you are the one who approves them. There is also a view showing whether your store **qualifies for Shopify Catalog**, with links to what you need to fix.

If you have read our guide to [Google’s AI Mode and SEO](/en/blog/google-ai-mode-peru-seo), the logic is the same: AI can only recommend your store well if your policies and product data are complete and clear.

### Manage your store from your AI assistant

**Shopify connectors** now work with **nine agents**: ChatGPT, Claude, Claude Duet, Microsoft Copilot, Google Gemini, Grok, Grok Bot, Muse and Perplexity. From them you can check and manage **products, inventory, orders and performance**. To see how this works in practice, we explained [how to connect Claude to your Shopify store](/en/blog/claude-shopify-connector).

## Sidekick, Canvas and a redesigned admin

- **Sidekick takes on technical work.** Shopify’s assistant has been rebuilt: it can now **run calculations, write code, search the internet and remember what you teach it**. You still have to approve the changes it proposes.
- **Canvas (early access).** It shows your entire store on a single canvas and lets you edit it with Sidekick, from small tweaks to full redesigns. According to TechCrunch, it is **desktop-only for now** and at launch did not support third-party themes, app blocks, markets or translations.
- **Admin redesign.** New colors, type and icons; a collapsible side navigation holds search, notifications and the store picker, and Sidekick appears as a floating chat on every page.

Canvas is appealing for experiments, but if your store runs a purchased theme, apps with blocks or multiple languages, it is wise to wait for it to mature before using it on your main store.

## Payments and fraud

- **Shopify Protect** brings risk and dispute tools into the admin to **block fraud at checkout** and fight chargebacks automatically. With the *Rule Builder* you can create and test your own fraud rules.
- **Seven new local payment methods** in Shopify Payments: Alipay, WeChat Pay, MB WAY, OXXO, Satispay, Scalapay and GrabPay. For Latin America, **OXXO** stands out, as it is widely used in Mexico.

Keep in mind that these features depend on **Shopify Payments**, which is not available in every country. If your store uses a different payment provider, check in your admin what applies to you before planning changes.

## The change you can’t ignore: the end of script tags

It is not part of the Edition, but it is the date that should worry you most. **Script tags** are an older method some apps use to inject code into your store (chat widgets, reviews, pixels, pop-ups). According to Shopify’s developer changelog:

| Date | What happens |
| --- | --- |
| October 1, 2026 | Apps can **no longer create or update** script tags. Existing ones keep running. |
| March 1, 2027 | Shopify **stops injecting script tags** into storefronts. |

The replacements are **app embed blocks**, which are turned on from the theme editor, and **web pixels** for tools that only collect analytics or conversion data. If an app in your store relies on script tags and is not updated, from March it **will simply stop working**, and that includes conversion tracking for your campaigns.

## What to check in your store this week

1. Go to **Sales channels > Agentic** and review the **Knowledge base**: fix policies, return windows and shipping destinations.
2. Check whether your store **qualifies for Shopify Catalog** and resolve anything it flags.
3. Ask your app vendors whether they **still use script tags** and when they will migrate.
4. Make sure your measurement (Meta pixel, Google Ads, GA4) **does not depend on a script tag**; if you migrate, avoid running the old and new code at the same time so you don’t double-count.
5. If you use Shopify Payments, turn on and test Shopify Protect’s **fraud rules**.
6. Try **Canvas or the new Sidekick** on a copy of your theme, not on the published one.

## In summary

The Fall 2026 Edition confirms where Shopify is heading: stores ready to sell inside AI conversations and an assistant that does more and more of the work for you. For a small business, the urgent part is not trying everything, but having **clear store data for AI agents** and making sure **your apps and tracking keep working after March 1, 2027**.

**Sources:** [Shopify: Exponential, the Fall ’26 Edition](https://www.shopify.com/news/fall-26-edition-merchant) · [Shopify Editions Fall ’26](https://www.shopify.com/editions/fall2026) · [TechCrunch: Shopify debuts Canvas](https://techcrunch.com/2026/10/01/shopify-debuts-canvas-a-way-to-build-online-stores-by-chatting-with-ai/) · [Shopify Developers: script tags will stop running on March 1, 2027](https://shopify.dev/changelog/posts/online-store-script-tags-deprecation)
