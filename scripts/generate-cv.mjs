/**
 * CV Generator Script
 * Generates CV PDFs using Tectonic LaTeX engine
 * Runs during build process
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, readFile, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import yaml from 'js-yaml';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Paths
const PROJECT_ROOT = join(__dirname, '..');
const TECTONIC_PATH = join(PROJECT_ROOT, '..', 'docs_and_backup', 'cv', 'tectonic', 'tectonic.exe');
const TEMP_DIR = join(PROJECT_ROOT, '.temp-cv');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public');
const PROJECTS_DIR = join(PROJECT_ROOT, 'src', 'content', 'projects');

/**
 * Escape LaTeX special characters
 */
function escapeLatex(text) {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Parse frontmatter from markdown file using js-yaml
 * Supports nested objects for bilingual content
 */
function parseFrontmatter(content) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n');
  
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    // Use js-yaml to parse YAML frontmatter (supports nested objects)
    const frontmatter = yaml.load(match[1]);
    return frontmatter;
  } catch (error) {
    console.error('Error parsing frontmatter:', error.message);
    return null;
  }
}

/**
 * Aggregate CV data from projects
 */
async function aggregateCVData() {
  // Get all project files
  const projectFiles = await glob(join(PROJECTS_DIR, '*.md').replace(/\\/g, '/'));
  
  const projects = [];
  const allTechStack = new Set();
  
  for (const file of projectFiles) {
    const content = await readFile(file, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    if (frontmatter) {
      // Handle bilingual title and summary
      const title = typeof frontmatter.title === 'object' 
        ? frontmatter.title 
        : { en: frontmatter.title, id: frontmatter.title };
      
      const summary = typeof frontmatter.summary === 'object'
        ? frontmatter.summary
        : { en: frontmatter.summary, id: frontmatter.summary };
      
      projects.push({
        title: title,
        summary: summary,
        year: frontmatter.year || '2025',
        techStack: Array.isArray(frontmatter.techStack) ? frontmatter.techStack : [],
        date: new Date(frontmatter.date || '2025-01-01'),
        status: frontmatter.status || 'completed',
        priority: frontmatter.priority || 0,
      });
      
      if (Array.isArray(frontmatter.techStack)) {
        frontmatter.techStack.forEach(tech => allTechStack.add(tech));
      }
    }
  }
  
  // Sort by priority (in-progress first) then by date (newest first)
  projects.sort((a, b) => {
    if (a.status === 'in-progress' && b.status !== 'in-progress') return -1;
    if (a.status !== 'in-progress' && b.status === 'in-progress') return 1;
    if (a.status === 'in-progress' && b.status === 'in-progress') {
      return (b.priority || 0) - (a.priority || 0);
    }
    return b.date - a.date;
  });
  
  // Categorize tech stack
  const languages = new Set();
  const frameworks = new Set();
  const tools = new Set();
  const libraries = new Set();
  
  const languagePatterns = ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Go', 'Node.js'];
  const frameworkPatterns = ['React', 'Next.js', 'Astro', 'Vue', 'Gin', 'Alpine.js', 'HTMX', 'Drizzle', 'Playwright'];
  const toolPatterns = ['Git', 'GitHub', 'Zed Editor', 'Figma', 'Blender'];
  const libraryPatterns = ['GSAP', 'Anime.js', 'LaTeX', 'Bootstrap', 'Axios', 'Framer Motion', 'SQLite', 'PostgreSQL', 'JSON Web Tokens', 'Tailwind CSS'];
  
  allTechStack.forEach(tech => {
    if (languagePatterns.some(p => tech.includes(p))) {
      languages.add(tech);
    } else if (frameworkPatterns.some(p => tech.includes(p))) {
      frameworks.add(tech);
    } else if (toolPatterns.some(p => tech.includes(p))) {
      tools.add(tech);
    } else if (libraryPatterns.some(p => tech.includes(p))) {
      libraries.add(tech);
    } else {
      frameworks.add(tech);
    }
  });

  tools.add('Git');
  tools.add('Zed Editor');
  
  return {
    personal: {
      name: 'Gerry Moeis M.D.P',
      phone: '088293253626',
      email: 'gerrymoeis@gmail.com',
      github: 'github.com/gerrymoeis',
      website: 'gerrymoeis.pages.dev',
    },
    education: [
      {
        institution: {
          en: 'State University of Surabaya',
          id: 'Universitas Negeri Surabaya',
        },
        location: {
          en: 'Surabaya, Indonesia',
          id: 'Surabaya, Indonesia',
        },
        degree: {
          en: 'Bachelor of Informatics Management',
          id: 'Sarjana Terapan Manajemen Informatika',
        },
        period: {
          en: '2023 -- Present',
          id: '2023 -- Sekarang',
        },
      },
    ],
    experience: [
      {
        title: {
          en: 'Studi Independen - VR Office Simulation',
          id: 'Studi Independen - Simulasi VR Perkantoran',
        },
        organization: {
          en: 'PT. Raja Teknik Solusi (MBKM Independent Study)',
          id: 'PT. Raja Teknik Solusi (MBKM Studi Independen)',
        },
        location: {
          en: 'Indonesia',
          id: 'Indonesia',
        },
        period: {
          en: '2026',
          id: '2026',
        },
        details: {
          en: [
            'Developed end-to-end VR office simulation prototype from concept to deployment',
            'Built 3D office environment, furniture, warehouse assets, and NPC characters using Blender',
            'Implemented VR interactions (interview system, office navigation, warehouse sorting) using Unity XR Interaction Toolkit',
            'Deployed executable for Windows and Android XR platforms',
          ],
          id: [
            'Mengembangkan prototipe VR simulasi perkantoran secara menyeluruh dari konsep awal hingga menjadi produk siap pakai',
            'Merancang dan mengimplementasikan berbagai skenario interaktif seperti simulasi wawancara, navigasi kantor, dan sortir barang',
            'Berhasil mendeploy aplikasi VR ke platform Windows dan Android XR sebagai bukti kemampuan pengembangan lintas platform',
          ],
        },
      },
      {
        title: {
          en: 'Head of Research and Technology Department',
          id: 'Kepala Departemen Riset dan Teknologi',
        },
        organization: {
          en: 'Himafortic',
          id: 'Himafortic',
        },
        location: {
          en: 'Surabaya, Indonesia',
          id: 'Surabaya, Indonesia',
        },
        period: {
          en: '2025',
          id: '2025',
        },
        details: {
          en: [
            'Led Innovation Lab coaching program for 100+ students in Web Development, Programming, and UI/UX Design',
            'Developed official website with automated scraping of competition information from Gemastik and Olivia',
            'Managed technology initiatives and research projects for the student organization',
          ],
          id: [
            'Memimpin program coaching Innovation Lab untuk 100+ mahasiswa dalam Web Development, Programming, dan UI/UX Design',
            'Mengembangkan website resmi dengan scraping otomatis informasi kompetisi dari Gemastik dan Olivia',
            'Mengelola inisiatif teknologi dan proyek penelitian untuk organisasi mahasiswa',
          ],
        },
      },
      {
        title: {
          en: 'PKM 2024 Funding Recipient',
          id: 'Penerima Pendanaan PKM 2024',
        },
        organization: {
          en: 'Ministry of Education and Culture',
          id: 'Kementerian Pendidikan dan Kebudayaan',
        },
        location: {
          en: 'Indonesia',
          id: 'Indonesia',
        },
        period: {
          en: '2024',
          id: '2024',
        },
        details: {
          en: [
            'Secured government funding for BugHunter project',
            'Developed prototype for programming education game concept',
          ],
          id: [
            'Mendapatkan pendanaan pemerintah untuk proyek BugHunter',
            'Mengembangkan prototipe konsep game edukasi pemrograman',
          ],
        },
      },
    ],
    projects: projects.filter(p => p.status !== 'experimental').map(p => ({
      title: p.title, // Keep as object { en, id }
      techStack: p.techStack,
      period: String(p.year),
      details: p.summary, // Keep as object { en, id }
    })),
    skills: {
      languages: Array.from(languages).sort(),
      frameworks: Array.from(frameworks).sort(),
      tools: Array.from(tools).sort(),
      libraries: Array.from(libraries).sort(),
    },
  };
}

/**
 * Generate LaTeX CV
 */
function generateLatexCV(data, lang = 'en') {
  const { personal, education, experience, projects, skills } = data;
  
  // Bilingual text
  const text = {
    en: {
      education: 'Education',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Technical Skills',
      languages: 'Languages',
      frameworks: 'Frameworks',
      tools: 'Developer Tools',
      libraries: 'Libraries',
      present: 'Present',
      pdfTitle: 'Gerry Moeis M.D.P - CV - ENG',
    },
    id: {
      education: 'Pendidikan',
      experience: 'Pengalaman',
      projects: 'Proyek',
      skills: 'Keahlian Teknis',
      languages: 'Bahasa Pemrograman',
      frameworks: 'Framework',
      tools: 'Alat Pengembangan',
      libraries: 'Library',
      present: 'Sekarang',
      pdfTitle: 'Gerry Moeis M.D.P - CV - ID',
    }
  };
  
  const t = text[lang];

  return `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Modified for: ${personal.name}
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

% PDF metadata
\\hypersetup{
  pdftitle={${t.pdfTitle}},
  pdfauthor={${personal.name}},
  pdfsubject={Curriculum Vitae},
  pdfkeywords={CV, Resume, Web Development, Programming}
}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{p{0.72\\textwidth}@{\\extracolsep{\\fill}}r}
      \\small\\raggedright #1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personal.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personal.phone)} $|$ \\href{mailto:${personal.email}}{\\underline{${escapeLatex(personal.email)}}} $|$ 
    \\href{https://${personal.github}}{\\underline{${escapeLatex(personal.github)}}} $|$
    \\href{https://${personal.website}}{\\underline{${escapeLatex(personal.website)}}}
\\end{center}

%-----------EDUCATION-----------
\\section{${t.education}}
  \\resumeSubHeadingListStart
${education.map(edu => `    \\resumeSubheading
      {${escapeLatex(edu.institution[lang])}}{${escapeLatex(edu.location[lang])}}
      {${escapeLatex(edu.degree[lang])}}{${escapeLatex(edu.period[lang])}}`).join('\n')}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{${t.experience}}
  \\resumeSubHeadingListStart
${experience.map(exp => `
    \\resumeSubheading
      {${escapeLatex(exp.title[lang])}}{${escapeLatex(exp.period[lang])}}
      {${escapeLatex(exp.organization[lang])}}{${escapeLatex(exp.location[lang])}}
      \\resumeItemListStart
${exp.details[lang].map(detail => `        \\resumeItem{${escapeLatex(detail)}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{${t.projects}}
    \\resumeSubHeadingListStart
${projects.map(proj => {
  const projectTitle = typeof proj.title === 'object' ? proj.title[lang] : proj.title;
  const projectDetails = typeof proj.details === 'object' ? [proj.details[lang]] : [proj.details];
  return `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(projectTitle)}} $|$ \\emph{${proj.techStack.map(escapeLatex).join(', ')}}}{${escapeLatex(proj.period)}}
          \\resumeItemListStart
${projectDetails.map(detail => `            \\resumeItem{${escapeLatex(detail)}}`).join('\n')}
          \\resumeItemListEnd`;
}).join('\n')}
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{${t.skills}}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${[
  skills.languages.length > 0 ? `     \\textbf{${t.languages}}{: ${skills.languages.map(escapeLatex).join(', ')}}` : null,
  skills.frameworks.length > 0 ? `     \\textbf{${t.frameworks}}{: ${skills.frameworks.map(escapeLatex).join(', ')}}` : null,
  skills.tools.length > 0 ? `     \\textbf{${t.tools}}{: ${skills.tools.map(escapeLatex).join(', ')}}` : null,
  skills.libraries.length > 0 ? `     \\textbf{${t.libraries}}{: ${skills.libraries.map(escapeLatex).join(', ')}}` : null,
].filter(Boolean).join(' \\\\\n')}
    }}
 \\end{itemize}

%-------------------------------------------
\\end{document}
`;
}

/**
 * Compile LaTeX to PDF using Tectonic
 */
async function compileLaTeX(texContent, outputName) {
  try {
    // Create temp directory if not exists
    await mkdir(TEMP_DIR, { recursive: true });

    // Write .tex file
    const texPath = join(TEMP_DIR, `${outputName}.tex`);
    await writeFile(texPath, texContent, 'utf-8');

    console.log(`📝 Compiling ${outputName}.tex...`);

    // Run Tectonic
    const { stdout, stderr } = await execFileAsync(TECTONIC_PATH, [
      '--outdir', OUTPUT_DIR,
      texPath
    ]);

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`✅ Generated ${outputName}.pdf`);
    return true;
  } catch (error) {
    console.error(`❌ Error compiling ${outputName}:`, error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting CV generation...\n');

  try {
    // Aggregate CV data
    console.log('📊 Aggregating CV data...');
    const cvData = await aggregateCVData();

    // Generate English version
    console.log('📄 Generating English CV...');
    const latexContentEN = generateLatexCV(cvData, 'en');
    const successEN = await compileLaTeX(latexContentEN, 'Gerry Moeis_CV_EN');

    // Generate Indonesian version
    console.log('📄 Generating Indonesian CV...');
    const latexContentID = generateLatexCV(cvData, 'id');
    const successID = await compileLaTeX(latexContentID, 'Gerry Moeis_CV_ID');

    // Cleanup temp directory
    try {
      await rm(TEMP_DIR, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }

    if (successEN && successID) {
      console.log('\n✨ CV generation completed successfully!');
      console.log(`📁 English: ${join(OUTPUT_DIR, 'Gerry Moeis_CV_EN.pdf')}`);
      console.log(`📁 Indonesian: ${join(OUTPUT_DIR, 'Gerry Moeis_CV_ID.pdf')}`);
    } else {
      console.error('\n❌ CV generation failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
