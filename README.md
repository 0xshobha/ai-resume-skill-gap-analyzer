# AI Resume Skill Gap Analyzer

An intelligent web application that analyzes your resume against job descriptions to identify skill gaps and provide personalized learning recommendations.

## Live Demo

[View Live Demo](https://ai-resume-skill-gap-analyzer.onrender.com)
*(Last Updated: 2026-01-13)*

## Features

- **Resume Upload**: Upload PDF or paste resume text directly
- **Skill Extraction**: Automatically identifies skills from resumes and job descriptions
- **Gap Analysis**: Compares your skills against job requirements
- **Match Percentage**: Shows how well your resume matches the job
- **Learning Recommendations**: Provides resources to learn missing skills
- **Categorized Results**: Skills organized by Programming, Frameworks, Cloud/DevOps, etc.

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **PDF Processing**: PyPDF2
- **Deployment**: Vercel

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/0xshobha/AI-Resume-Skill-Gap-Analyzer.git
   cd AI-Resume-Skill-Gap-Analyzer
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open http://localhost:5000 in your browser

## How It Works

1. Upload your resume (PDF) or paste the text
2. Paste the job description you're applying for
3. Click "Analyze" to see your skill match
4. Review missing skills and learning recommendations

## License

MIT License
