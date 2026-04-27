# 🚀 AI-Powered CV Optimizer — n8n Workflow

An automated pipeline that takes your resume (PDF) + a job role + location, searches LinkedIn for real job listings, and returns a fully rewritten, ATS-optimized CV as a PDF — tailored to an actual job description.

---

## Demo Video
https://github.com/user-attachments/assets/a06c37d9-b52a-4a74-a9da-50b9c291e59e

## 🧠 How It Works

```
User sends PDF + job role + location
        ↓
Extract text from PDF
        ↓
Parse resume with AI (Groq / LLaMA)
        ↓
Scrape LinkedIn jobs via Apify
        ↓
Pick top job → extract job description with AI
        ↓
Rewrite CV to match job description (ATS optimized)
        ↓
Convert to HTML → PDF
        ↓
Return PDF to user
```

---

## 📦 Tech Stack

| Component | Tool |
|---|---|
| Workflow automation | n8n |
| AI model | Groq API (LLaMA 3.1 8B Instant) |
| Job scraping | Apify LinkedIn Jobs Scraper |
| PDF generation | HTMLCSSto PDF (PDFMunk) |
| Frontend | Lovable (or any HTTP-capable frontend) |

---

## ⚙️ Prerequisites & Setup

### 1. 🔑 Groq API Key

Groq provides a free, fast API for running LLaMA models.

1. Go to [https://console.groq.com](https://console.groq.com) and sign up
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key** and copy it
4. In the n8n workflow, replace the `Authorization` header value in these nodes:
   - `Resume Parser`
   - `Job Description Agent`
   - `CV Optimizer Agent`

   Replace with:
   ```
   Bearer YOUR_GROQ_API_KEY_HERE
   ```

> The workflow uses `llama-3.1-8b-instant` — fast and free tier friendly.

---

### 2. 🕷️ Apify — LinkedIn Jobs Scraper

Apify is used to scrape real LinkedIn job listings based on your desired role and location.

1. Go to [https://apify.com](https://apify.com) and sign up (free tier available)
2. Navigate to **Settings → Integrations → API tokens**
3. Copy your **Personal API Token**
4. In the n8n workflow, find the **Apify LinkedIn Jobs** node and update the URL:
   ```
   https://api.apify.com/v2/acts/bebity~linkedin-jobs-scraper/runs?token=YOUR_APIFY_TOKEN
   ```
5. Also update the **Get Jobs Data** node — replace the token in the query parameters:
   ```
   token: YOUR_APIFY_TOKEN
   ```

> The scraper uses the `bebity~linkedin-jobs-scraper` actor. Make sure it's available in your Apify account (it's a public actor — no extra setup needed).

---

### 3. 📄 HTMLCSStoPDF Node (PDFMunk)

This converts the AI-generated HTML resume into a downloadable PDF.

#### Option A — Cloud / n8n.cloud (Recommended)

1. Go to **Settings → Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter: `n8n-nodes-htmlcsstopdf`
4. Click **Install**

#### Option B — Self-hosted / Local

```bash
# Navigate to your n8n installation directory
cd ~/.n8n/nodes

# Install the package
npm install n8n-nodes-htmlcsstopdf
```

Then restart your n8n instance.

#### Get your PDFMunk API Key

1. Go to [https://pdfmunk.com](https://pdfmunk.com) and sign up
2. Navigate to your **Dashboard → API Key**
3. Copy the API key
4. In n8n, go to **Credentials → New Credential**
5. Search for `HTML CSS to PDF` and enter your PDFMunk API key
6. Link this credential to the **Convert HTML to PDF** node in the workflow

---

## 🔌 Importing the Workflow into n8n

1. Open your n8n instance (e.g., `http://localhost:5678`)
2. Go to **Workflows** in the sidebar
3. Click **Import from file**
4. Upload `My_workflow.json`
5. Update all API keys as described above
6. Click **Save** and then **Activate**

---

## 🌐 Webhook Endpoint

Once the workflow is active, it exposes a POST endpoint:

**Test (while building):**
```
POST http://localhost:5678/webhook-test/optimize-cv
```

**Production (after activating):**
```
POST http://localhost:5678/webhook/optimize-cv
```

### Expected Request Format

Send a `multipart/form-data` POST request with:

| Field | Type | Description |
|---|---|---|
| `file` | File (PDF) | The user's current resume |
| `role` | String | Job title to search for (e.g. `"Data Analyst"`) |
| `location` | String | Location (e.g. `"London"`) |
| `work_preference` | String | `"remote"`, `"hybrid"`, or `"onsite"` |

### Response

Returns a binary PDF file — the rewritten, ATS-optimized CV.

---

## 🎨 Frontend Setup (Lovable or any frontend)

You can build a simple frontend on [Lovable](https://lovable.dev) or any other tool.

Your form should:
- Have a **file upload** field for the PDF resume
- Have text inputs for **role**, **location**, and **work preference**
- On submit, send a `multipart/form-data` POST to the webhook URL above
- Display / trigger a download of the returned PDF

**Example fetch (JavaScript):**

```javascript
const formData = new FormData();
formData.append('file', resumePdfFile);          // File object from input
formData.append('role', 'Software Engineer');
formData.append('location', 'Berlin');
formData.append('work_preference', 'hybrid');

const response = await fetch('http://localhost:5678/webhook-test/optimize-cv', {
  method: 'POST',
  body: formData,
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);

// Trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'Optimized_CV.pdf';
a.click();
```

> ⚠️ If hosting your frontend on a different domain, make sure CORS is handled in n8n or via a proxy.

---

## 📝 Workflow Nodes — Quick Reference

| Node | What it does |
|---|---|
| **Webhook** | Receives the PDF + job preferences from the frontend |
| **Extract from File** | Pulls raw text out of the uploaded PDF |
| **Resume Parser** | AI extracts structured info (skills, experience, education) |
| **Apify LinkedIn Jobs** | Scrapes up to 10 real LinkedIn jobs matching role + location |
| **Wait1 / Wait / Wait2** | Buffers async operations (Apify takes ~20s to scrape) |
| **Get Jobs Data** | Fetches scraped job listings from Apify dataset |
| **Job Description Agent** | AI extracts key info from the top job description |
| **Limit** | Takes only the top 1 job to optimize against |
| **CV Optimizer Agent** | AI rewrites the resume to match the job, ATS-style |
| **Code in JavaScript** | Converts markdown formatting to clean HTML |
| **Convert HTML to PDF** | Renders the HTML resume as a downloadable PDF |
| **Respond to Webhook** | Sends the PDF back to the frontend |

---

## ⚠️ Known Limitations

- Apify scraping takes ~20 seconds — the 3 Wait nodes handle this
- LLaMA 3.1 8B has a context limit; very long resumes are trimmed to 2500 characters for job parsing
- The workflow optimizes against **1 job listing** (the top result) — you can remove the `Limit` node to process more
- The CV Optimizer is instructed **not to invent experience** — it only reframes what exists

---

## 🛠️ Customization Tips

- **Change the AI model:** Swap `llama-3.1-8b-instant` with `llama-3.3-70b-versatile` in Groq for better quality (slower)
- **More jobs:** Remove or increase the `Limit` node to process multiple job descriptions
- **Different job board:** Replace the Apify node with any other job scraper API
- **Styling the PDF:** Edit the JavaScript code node to change fonts, colors, and layout of the output CV

---

## 📬 Support

If you run into issues:
- Check n8n execution logs under **Executions** tab
- Verify all API keys are active and have sufficient quota
- Apify free tier has limited runs — monitor usage at [apify.com/billing](https://apify.com/billing)
- Groq free tier has rate limits — check [console.groq.com](https://console.groq.com)
