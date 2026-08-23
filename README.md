# Social Media Content Analyzer

A web-based application that analyzes social media content from text, PDFs, and images and provides measurable insights and improvement suggestions for creating clearer, more engaging, and platform-appropriate posts.

---

## 1. Project Overview

Social media content is often created without a structured way to evaluate its readability, engagement potential, sentiment, and platform compatibility.

The **Social Media Content Analyzer** was developed to address this problem by providing a single web application where users can upload social media content or enter text directly and receive a detailed content analysis.

The application extracts content from **PDF documents and images**, analyzes the extracted text using rule-based linguistic and social-media metrics, and presents the results through an interactive dashboard.

The project is designed as a **client-side web application**, meaning document processing and OCR are performed directly in the user's browser.

---

## 2. Objectives

The main objectives of this project are:

* To develop a web application for analyzing social media content.
* To extract text automatically from PDFs and images.
* To calculate measurable content and readability metrics.
* To identify areas where a social media post can be improved.
* To provide platform-specific previews for major social media platforms.
* To maintain user privacy by processing uploaded files locally in the browser.
* To provide downloadable reports for analyzed content.

---

## 3. Key Features

### 3.1 Multi-Format Content Input

The application supports multiple methods of providing content:

* Direct text input
* PDF file upload
* JPG/JPEG image upload
* PNG image upload
* Drag-and-drop file upload
* Sample social media posts for testing

### 3.2 PDF Text Extraction

PDF documents are processed page-by-page using **pdfjs-dist**.

The system extracts text from supported PDF documents and combines the extracted content for further analysis.

This can be useful for analyzing:

* Social media carousels
* Presentation slides
* Marketing documents
* Content drafts
* PDF-based promotional material

### 3.3 Image OCR

Images containing text are processed using **Tesseract.js**.

The OCR module allows users to analyze text present in:

* Screenshots
* Infographics
* Social media creatives
* Posters
* Image-based posts

OCR progress is displayed to the user during processing.

### 3.4 Content Analysis

The extracted or entered text is evaluated using multiple metrics.

#### Engagement Analysis

The application generates an engagement score from 0–100 based on factors such as:

* Opening hook strength
* Call-to-action presence
* Content structure
* Sentence and paragraph distribution
* Emotional/power word usage
* Hashtag usage
* Audience engagement opportunities

The score is intended as an analytical indicator rather than a prediction of actual platform performance.

#### Readability Analysis

The application calculates:

* Word count
* Character count
* Character count excluding spaces
* Sentence count
* Paragraph count
* Estimated reading time
* Estimated speaking time
* Flesch Reading Ease score

#### Sentiment Analysis

The application performs basic rule-based sentiment analysis and categorizes content as:

* Positive
* Neutral
* Negative

It also identifies selected emotional or trigger words present in the content.

#### Hashtag and Emoji Analysis

The analyzer identifies:

* Number of hashtags
* Hashtag density
* Number of emojis
* Hashtag usage patterns

---

## 4. Content Improvement Recommendations

After analyzing the content, the application generates recommendations based on the detected characteristics.

Recommendations are categorized into:

* **High Priority** – Issues that may significantly affect readability or engagement.
* **Medium Priority** – Areas that could improve content quality.
* **Growth Tips** – Additional suggestions for improving the post.

Where applicable, users can copy a suggested improvement and insert it into the content editor.

---

## 5. Social Media Platform Simulation

The application provides preview simulations for:

* X (Twitter)
* LinkedIn
* Instagram
* Facebook

These previews help users understand how the same content may appear on different platforms.

The simulator considers platform-specific characteristics such as:

* Content length
* Text presentation
* Character boundaries
* Hashtag placement
* Feed-style presentation

---

## 6. Export and Reporting

Users can export their analysis results in multiple formats:

* Markdown (`.md`)
* JSON (`.json`)
* Plain Text (`.txt`)

The application also supports browser-based printing of the analysis report.

This allows users to retain or share the results of their content analysis.

---

## 7. System Architecture

The application follows a modular client-side architecture.

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Input Interface   │
                    │ Text / PDF / Image  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │  PDF Extractor  │          │   OCR Engine    │
       │   pdfjs-dist    │          │  Tesseract.js   │
       └────────┬────────┘          └────────┬────────┘
                │                            │
                └──────────────┬─────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Extracted / Edited  │
                    │       Content       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Content Analyzer  │
                    │                     │
                    │ Engagement          │
                    │ Sentiment           │
                    │ Readability         │
                    │ Hashtags / Emojis   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Dashboard   │ │ Suggestions │ │ Platform    │
        │ & Metrics   │ │             │ │ Simulator   │
        └─────────────┘ └─────────────┘ └─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Report Export       │
                    │ MD / JSON / TXT     │
                    └─────────────────────┘
```

---

## 8. Technology Stack

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React 19        | Front-end UI development          |
| Vite            | Development server and build tool |
| TypeScript      | Type-safe application development |
| Tailwind CSS    | UI styling and responsive design  |
| Motion          | UI animations and transitions     |
| pdfjs-dist      | PDF text extraction               |
| Tesseract.js    | Image OCR                         |
| react-dropzone  | Drag-and-drop file handling       |
| lucide-react    | Interface icons                   |
| canvas-confetti | User feedback/celebration effects |

---

## 9. Project Structure

```text
social-media-content-analyzer/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── DropzoneArea.tsx
│   │   ├── EngagementGauge.tsx
│   │   ├── ExportModal.tsx
│   │   ├── ExtractionProgress.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroLanding.tsx
│   │   ├── Navbar.tsx
│   │   ├── PlatformSimulator.tsx
│   │   ├── RawTextEditor.tsx
│   │   ├── SentimentCard.tsx
│   │   ├── StatsGrid.tsx
│   │   └── SuggestionsList.tsx
│   │
│   ├── utils/
│   │   ├── nlpAnalyzer.ts
│   │   ├── ocrExtractor.ts
│   │   ├── pdfExtractor.ts
│   │   └── samplePosts.ts
│   │
│   ├── types.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

## 10. Important Modules

### `App.tsx`

Acts as the main application controller and connects the different components and analysis modules.

### `pdfExtractor.ts`

Handles PDF loading and page-wise text extraction using `pdfjs-dist`.

### `ocrExtractor.ts`

Handles image processing and OCR using Tesseract.js.

### `nlpAnalyzer.ts`

Contains the core content-analysis logic, including:

* Engagement scoring
* Readability calculations
* Sentiment classification
* Hashtag analysis
* Emoji analysis
* Content recommendations

### `PlatformSimulator.tsx`

Generates platform-specific content previews for X, LinkedIn, Instagram, and Facebook.

### `ExportModal.tsx`

Handles exporting analysis results into Markdown, JSON, and plain-text formats.

---

## 11. Privacy and Security

Privacy was considered during the design of the application.

The document extraction and OCR workflows are designed to run **client-side in the user's browser**.

Therefore:

* Uploaded files do not need to be sent to an application server for PDF extraction.
* Image OCR is performed using Tesseract.js in the browser.
* No application database is required for storing uploaded documents.
* Extracted content remains within the browser during the analysis workflow.

This architecture reduces the need for transmitting potentially sensitive documents to external processing services.

> Note: Browser-side processing does not automatically guarantee complete privacy in every deployment. Third-party libraries, hosting configuration, and browser behavior should also be considered when deploying the application.

---

## 12. Challenges Addressed

During development, several technical challenges were addressed:

### Handling Multiple Input Formats

PDFs and images require different processing approaches. The application uses separate extraction pipelines for PDF text and image OCR.

### Client-Side OCR

OCR can be computationally intensive in the browser. Progress feedback was incorporated so that users can understand the processing status.

### Content Normalization

Extracted text may contain inconsistent spacing, line breaks, or formatting. The content needs to be normalized before applying analysis algorithms.

### Designing Meaningful Metrics

Social media engagement cannot be accurately predicted using a simple formula. Therefore, the engagement score is presented as an analytical score based on observable content characteristics rather than as a guaranteed prediction of performance.

### Responsive User Interface

The application is designed to work across desktop and smaller screen sizes while displaying analysis metrics, suggestions, and platform previews.

---

## 13. Learning Outcomes

This project provided practical experience in:

* React application development
* TypeScript and component-based architecture
* Client-side file processing
* PDF parsing
* Optical Character Recognition
* Rule-based text analysis
* Responsive UI development
* Data visualization and dashboard design
* Modular software architecture
* Front-end performance considerations
* Privacy-aware application design

---

## 14. Future Enhancements

The current application can be extended with additional capabilities such as:

1. **AI-powered content recommendations**
   Integrate an LLM to generate context-aware rewriting and improvement suggestions.

2. **Real social-media API integration**
   Compare analytical scores with actual post performance metrics.

3. **User accounts and history**
   Allow users to save and compare previous analyses.

4. **Advanced NLP models**
   Improve sentiment, emotion, topic, and intent detection using trained NLP models.

5. **Additional platforms**
   Add support for YouTube, Threads, Pinterest, and other platforms.

6. **Content comparison**
   Compare multiple versions of the same post and identify which version has stronger characteristics.

7. **Accessibility improvements**
   Add enhanced keyboard navigation, screen-reader support, and accessibility scoring.

---

## 15. Installation and Local Setup

### Prerequisites

* Node.js 18 or higher
* npm, yarn, or pnpm

### Clone the Project

```bash
git clone https://github.com/your-username/social-media-content-analyzer.git
cd social-media-content-analyzer
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local development URL displayed by Vite in the terminal.

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 16. Deployment

The application is a Vite-based React application and can be deployed using platforms such as Vercel, Netlify, or GitHub Pages, depending on the project's configuration.

For Vercel deployment:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select the Vite framework preset.
4. Use the following build configuration:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Deploy the project.

---

## 17. Project Information

**Project Name:** Social Media Content Analyzer

**Project Type:** Web Application

**Domain:** Web Development / Content Analysis

**Frontend:** React + TypeScript

**Architecture:** Client-Side Application

**Primary Functions:**
PDF Extraction · OCR · Text Analysis · Engagement Analysis · Sentiment Analysis · Platform Simulation · Report Generation

**License:** MIT

---

## 18. Conclusion

The **Social Media Content Analyzer** demonstrates how modern web technologies can be combined to build a practical content-analysis application.

The project integrates file processing, OCR, text analysis, responsive UI design, and report generation into a single application. Its modular architecture also provides a foundation for future integration with advanced NLP and AI-based content-generation systems.

The project demonstrates practical knowledge of **frontend development, TypeScript, browser-based processing, software modularity, and user-focused application design**.
