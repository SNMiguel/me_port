import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import './Header.scss';

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: 'easeInOut'
    }
  }
}

const resumeData = {
  summary: "Aspiring software developer and AI enthusiast, passionate about building impactful projects, learning cutting-edge technologies, and growing as a leader in tech. Strong foundation in Python, web development, and problem-solving, with experience gained through hackathons, personal projects, and collaborative communities.",
  experience: [
  {
    title: "Hackathon Participant",
    company: "Grambling State University",
    period: "2024",
    description: "Collaborated with a team to develop a recycling app that identified waste and mapped nearby disposal points. Gained hands-on experience in teamwork, prototyping, and presenting innovative solutions."
  },
  {
    title: "Project Creator",
    company: "Personal Projects",
    period: "2023 - Present",
    description: "Built and explored applications ranging from stock price regression with machine learning to weather forecasting tools. Focused on writing clean, readable code while applying core computer science and problem-solving skills."
  },
  {
    title: "Community Member",
    company: "ColorStack, NSBE, ALD",
    period: "2024 - Present",
    description: "Engage in networking, mentorship, and leadership communities that support Black and first-generation students in tech. Recognized as an Alpha Lambda Delta Honor Society honoree for academic excellence."
  }
],
  skills: {
    frontend: ["React", "JavaScript", "HTML/CSS", "Redux", "SASS"],
    backend: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    tools: ["Git", "Docker", "AWS", "Figma"]
  },
  education: {
    degree: "Bachelor of Computer Science",
    school: "Grambling State University",
    year: "2028"
  }
};

const Header = () => {
  const [showResume, setShowResume] = useState(false);

  return (
    <div className='app__header app__flex'>
      <motion.div
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 5 }}
        className='app__header-info'
      >
        <div className='app__header-badge'>
          <div className='badge-cmp app__flex'>
            <span>👋</span>
            <div style={{ marginLeft: 20 }}>
              <p className='p-text'>Hello, I am</p>
              <h1 className='head-text'>Miguel</h1>
            </div>
          </div>

          <div className='resume-section'>
            <motion.button 
              className='resume-btn'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResume(!showResume)}
            >
              {showResume ? '✕ Close Resume' : '📄 View My Resume'}
            </motion.button>
            
            <AnimatePresence>
              {showResume && (
                <motion.div 
                  className='resume-viewer'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='resume-content'>
                    <section className='resume-section-item'>
                      <h3>Summary</h3>
                      <p>{resumeData.summary}</p>
                    </section>

                    <section className='resume-section-item'>
                      <h3>Experience</h3>
                      {resumeData.experience.map((job, index) => (
                        <div key={index} className='experience-item'>
                          <h4>{job.title}</h4>
                          <p className='company'>{job.company} • {job.period}</p>
                          <p className='description'>{job.description}</p>
                        </div>
                      ))}
                    </section>

                    <section className='resume-section-item'>
                      <h3>Skills</h3>
                      <div className='skills-grid'>
                        <div className='skill-category'>
                          <h4>Frontend</h4>
                          <div className='skill-tags'>
                            {resumeData.skills.frontend.map((skill, i) => (
                              <span key={i} className='skill-tag'>{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className='skill-category'>
                          <h4>Backend</h4>
                          <div className='skill-tags'>
                            {resumeData.skills.backend.map((skill, i) => (
                              <span key={i} className='skill-tag'>{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className='skill-category'>
                          <h4>Tools</h4>
                          <div className='skill-tags'>
                            {resumeData.skills.tools.map((skill, i) => (
                              <span key={i} className='skill-tag'>{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className='resume-section-item'>
                      <h3>Education</h3>
                      <h4>{resumeData.education.degree}</h4>
                      <p>{resumeData.education.school} • {resumeData.education.year}</p>
                    </section>
                  </div>
                  
                  <div className='resume-actions'>
                    <motion.a 
                      href='./July_2025_Resume.pdf' 
                      download
                      className='download-btn'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ⬇ Download PDF
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileInView={{ opacity: [0, 1] }}
        transition={{ duration: 5, delayChildren: 0.5 }}
        className='app__header-img'
      >
        <img src={images.profile} alt="profile_bg" />
        <motion.img
          whileInView={{ scale: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className='overlay_circle'
          src={images.circle}
          alt="profile_circle"
        />
      </motion.div>
      
      <motion.div
        variants={scaleVariants}
        whileInView={scaleVariants.whileInView}
        className='app__header-circles'
      >
        {[images.flutter, images.redux, images.sass].map((circle, index) => (
          <div className='circle-cmp app__flex' key={`circle-${index}`}>
            <img src={circle} alt="circle" />
          </div>
        ))}
      
      </motion.div>
    </div>
  )
}

export default AppWrap(Header, 'home');