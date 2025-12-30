from flask import Flask, render_template, request, jsonify
import os
import re
from PyPDF2 import PdfReader
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Comprehensive skill database organized by categories
SKILL_DATABASE = {
    'programming_languages': [
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'golang',
        'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'shell',
        'powershell', 'sql', 'html', 'css', 'sass', 'less', 'dart', 'lua', 'haskell'
    ],
    'frameworks': [
        'react', 'angular', 'vue', 'vuejs', 'nextjs', 'next.js', 'nuxt', 'django', 'flask',
        'fastapi', 'spring', 'spring boot', 'express', 'expressjs', 'node', 'nodejs',
        'rails', 'ruby on rails', 'laravel', 'asp.net', '.net', 'dotnet', 'flutter',
        'react native', 'electron', 'svelte', 'ember', 'backbone', 'jquery', 'bootstrap',
        'tailwind', 'tailwindcss', 'material ui', 'chakra ui'
    ],
    'databases': [
        'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch',
        'cassandra', 'dynamodb', 'firebase', 'sqlite', 'oracle', 'sql server',
        'mariadb', 'neo4j', 'couchdb', 'influxdb', 'snowflake', 'bigquery'
    ],
    'cloud_devops': [
        'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker',
        'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions', 'terraform',
        'ansible', 'puppet', 'chef', 'nginx', 'apache', 'linux', 'unix', 'ci/cd',
        'devops', 'microservices', 'serverless', 'lambda', 'heroku', 'vercel', 'netlify'
    ],
    'data_science_ai': [
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
        'scikit-learn', 'sklearn', 'pandas', 'numpy', 'scipy', 'matplotlib',
        'seaborn', 'jupyter', 'data analysis', 'data science', 'nlp',
        'natural language processing', 'computer vision', 'opencv', 'neural networks',
        'ai', 'artificial intelligence', 'data mining', 'statistics', 'tableau',
        'power bi', 'spark', 'hadoop', 'airflow', 'etl', 'data engineering'
    ],
    'soft_skills': [
        'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
        'project management', 'agile', 'scrum', 'kanban', 'time management',
        'collaboration', 'presentation', 'analytical', 'creative', 'detail oriented',
        'self motivated', 'adaptable', 'mentoring', 'strategic thinking'
    ],
    'tools': [
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack',
        'trello', 'asana', 'notion', 'figma', 'sketch', 'adobe xd', 'photoshop',
        'illustrator', 'vs code', 'visual studio', 'intellij', 'postman', 'swagger',
        'rest api', 'graphql', 'grpc', 'websocket', 'oauth', 'jwt'
    ],
    'certifications': [
        'aws certified', 'azure certified', 'google certified', 'pmp', 'scrum master',
        'cissp', 'comptia', 'ccna', 'ccnp', 'cka', 'ckad', 'terraform certified'
    ]
}

def extract_text_from_pdf(file_path):
    """Extract text content from a PDF file."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return ""

def extract_skills(text):
    """Extract skills from text using pattern matching."""
    text = text.lower()
    found_skills = set()
    
    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            # Create pattern that matches whole words
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text):
                found_skills.add(skill.title())
    
    return list(found_skills)

def categorize_skills(skills):
    """Categorize skills into their respective categories."""
    categorized = {}
    for skill in skills:
        skill_lower = skill.lower()
        for category, category_skills in SKILL_DATABASE.items():
            if skill_lower in [s.lower() for s in category_skills]:
                category_name = category.replace('_', ' ').title()
                if category_name not in categorized:
                    categorized[category_name] = []
                categorized[category_name].append(skill)
                break
    return categorized

def analyze_skill_gap(resume_skills, job_skills):
    """Analyze the gap between resume skills and job requirements."""
    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    
    matched = resume_set.intersection(job_set)
    missing = job_set - resume_set
    extra = resume_set - job_set
    
    # Calculate match percentage
    if len(job_set) > 0:
        match_percentage = int((len(matched) / len(job_set)) * 100)
    else:
        match_percentage = 100
    
    return {
        'matched': [s.title() for s in matched],
        'missing': [s.title() for s in missing],
        'extra': [s.title() for s in extra],
        'match_percentage': match_percentage
    }

def generate_recommendations(missing_skills):
    """Generate learning recommendations for missing skills."""
    recommendations = []
    
    skill_resources = {
        'python': 'Learn Python through Codecademy, Python.org tutorials, or Automate the Boring Stuff',
        'java': 'Master Java with Oracle tutorials, Udemy courses, or Java Programming Masterclass',
        'javascript': 'Build JS skills with freeCodeCamp, JavaScript.info, or Eloquent JavaScript',
        'react': 'Learn React through official docs, React tutorial, or Scrimba React course',
        'aws': 'Get AWS certified through A Cloud Guru, AWS Skill Builder, or Stephane Maarek courses',
        'docker': 'Master Docker with Docker documentation, Play with Docker, or Docker Mastery course',
        'kubernetes': 'Learn K8s through Kubernetes.io, KodeKloud, or CKA certification prep',
        'machine learning': 'Start ML journey with Coursera ML course, fast.ai, or Kaggle Learn',
        'sql': 'Practice SQL on SQLZoo, LeetCode, or Mode Analytics SQL Tutorial',
        'git': 'Master Git with Git documentation, Atlassian tutorials, or Oh My Git! game'
    }
    
    for skill in missing_skills[:5]:  # Top 5 recommendations
        skill_lower = skill.lower()
        if skill_lower in skill_resources:
            recommendations.append({
                'skill': skill,
                'resource': skill_resources[skill_lower]
            })
        else:
            recommendations.append({
                'skill': skill,
                'resource': f'Search for "{skill}" tutorials on YouTube, Coursera, or Udemy'
            })
    
    return recommendations

@app.route('/')
def index():
    """Render the main upload page."""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze resume against job description."""
    resume_text = ""
    
    # Handle file upload
    if 'resume_file' in request.files:
        file = request.files['resume_file']
        if file and file.filename:
            filename = secure_filename(file.filename)
            if filename.endswith('.pdf'):
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                resume_text = extract_text_from_pdf(file_path)
                os.remove(file_path)  # Clean up
            elif filename.endswith('.txt'):
                resume_text = file.read().decode('utf-8')
    
    # Handle pasted resume text
    if not resume_text:
        resume_text = request.form.get('resume_text', '')
    
    job_description = request.form.get('job_description', '')
    
    if not resume_text or not job_description:
        return render_template('index.html', error='Please provide both resume and job description')
    
    # Extract skills
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # Analyze gap
    analysis = analyze_skill_gap(resume_skills, job_skills)
    
    # Categorize skills
    matched_categorized = categorize_skills(analysis['matched'])
    missing_categorized = categorize_skills(analysis['missing'])
    extra_categorized = categorize_skills(analysis['extra'])
    
    # Generate recommendations
    recommendations = generate_recommendations(analysis['missing'])
    
    results = {
        'match_percentage': analysis['match_percentage'],
        'matched_skills': analysis['matched'],
        'missing_skills': analysis['missing'],
        'extra_skills': analysis['extra'],
        'matched_categorized': matched_categorized,
        'missing_categorized': missing_categorized,
        'extra_categorized': extra_categorized,
        'recommendations': recommendations,
        'total_resume_skills': len(resume_skills),
        'total_job_skills': len(job_skills)
    }
    
    return render_template('results.html', results=results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
