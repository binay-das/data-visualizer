# DataScope - Client-Side Dataset Visualizer 📊

![DataScope](https://img.shields.io/badge/Status-Live-brightgreen.svg) ![License](https://img.shields.io/badge/License-MIT-blue.svg)

DataScope is a powerful, lightning-fast, and completely client-side data analysis and visualization tool. Simply upload your datasets (CSV, JSON, or Excel) to instantly clean, manipulate, pivot, and visualize your data securely within the browser. **No servers, no queues, 100% private.**

🌍 **Live Demo:** [https://data-visualizer-peach.vercel.app](https://data-visualizer-peach.vercel.app)

---

## ✨ Features

### 📁 Advanced Ingestion
- **Formats Supported:** Seamlessly imports `CSV`, `JSON`, and `Excel (.xlsx/.xls)`.
- **Drag & Drop Workspace:** Drop files directly into the secure dropzone to launch the workspace instantly.

### 🧹 Data Cleaning Engine
- **Fix Missing Data:** Fill null values intelligently (Mean, Median, Mode, Zero, or Empty Strings).
- **Shape Datasets:** Easily rename or drop irrelevant columns.
- **Deduplication:** Remove completely identical rows with a click.

### 🔄 Data Transformation & Pivoting
- **Pivot Tables (Grouping):** Roll up your datasets by categorical columns to aggregate numeric values using `Sum`, `Average`, `Count`, `Min`, or `Max`.
- **Advanced Filtering/Sorting:** A robust query builder allowing multiple rules natively on the data tables (`greater than`, `less than`, `contains`, `equals`).

### 📈 Instant Visualizations & Insights
- **Chart Builder:** Convert metrics dynamically into Bar, Line, Scatter, Pie, or Histogram charts without touching a spreadsheet.
- **Statistical Analysis:** View Pearson Correlation Matrices automatically computed for matching continuous variables, highlighting positive and negative correlations.
- **Outlier Detection:** Intelligent system parses numerical boundaries and detects interquartile (IQR) outliers on the fly.

### 💾 Export Anywhere
- Cleaned and prepared data stays local until you push it out. Export refined datasets backward to cleanly formatted `CSV`, `JSON`, or `Excel` sheets.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + minimal/monochrome Shadcn (Base-UI integration)
- **Icons:** Lucide React
- **Charting:** Recharts
- **Parsers:** PapaParse (CSV), XLSX (Excel)
- **Deployment:** Vercel



---

## 🔒 Privacy & Architecture

The key philosophy embedded in DataScope is pure localization. Data processing is shifted away from traditional backend Python wrappers (like Pandas) entirely to the edge inside the browser's JavaScript engine. Your uploaded files intentionally **never touch an external server database**.

---

## 🤝 Contributing

Contributions are always welcome. Just fork this repository, create and checkout your feature branch, commit your polished code, and push the branch to open a Pull Request.

---

*Made with love by [binay](https://github.com/binay-das)*
