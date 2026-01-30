# WhatsApp Order Automation

An AI-powered automation system that processes customer orders received via WhatsApp, converts unstructured messages into structured data, calculates pricing automatically, and stores everything in Excel.

---

## Overview

Small businesses often receive orders through WhatsApp in free-text formats, which leads to:

- Manual data entry
- Human errors
- Delayed billing
- Poor order tracking

This project solves that problem by building an end-to-end automation pipeline.

---

## 🔁 Workflow Architecture

WhatsApp Message
↓
whatsapp-web.js (listener)
↓
n8n Webhook
↓
AI Parsing (Ollama - local LLM)
↓
Output Parser (JSON)
↓
Price Calculation Engine
↓
Excel / Google Sheets
↓
WhatsApp Confirmation 👍


---

## Features

- Reads orders directly from a personal WhatsApp number
- AI-based parsing of unstructured messages
- Converts messages into structured JSON
- Automatic quantity normalization (kg / gm)
- Dynamic price calculation
- Auto total generation
- Excel / Google Sheets integration
- WhatsApp confirmation only after successful data entry
- Fully local AI (no OpenAI dependency)

---

##  Tech Stack

- Node.js
- whatsapp-web.js
- n8n (self-hosted)
- Ollama (local LLM)/Groq AI
- JavaScript
- Google Sheets / Excel

---

##  Project Structure

Whatsapp-order-automation/
│
├── whatsapp-bridge/ 
├── n8n-workflows/ 
├── architecture.md
├── architecture.png
└── README.md


---

## ⚙️ Setup Summary

### WhatsApp Bridge
- Built using `whatsapp-web.js`
- Listens only to approved numbers
- Forwards messages to n8n via webhook

### n8n Automation
- Webhook trigger
- AI parsing using Ollama
- Output parsing to strict JSON
- Price computation
- Excel append
- Success-based confirmation

---

## ⚠️ Disclaimer

This project uses `whatsapp-web.js`, which is an unofficial WhatsApp Web library.

This system is intended for:
- Internal automation
- Learning purposes
- Small-scale personal workflows

It should **not** be used for bulk messaging or spam.

---

## 📌 Future Improvements

- Invoice PDF generation
- Inventory tracking
- Order analytics dashboard
- Admin notification system
- Migration to official WhatsApp Cloud API

---
