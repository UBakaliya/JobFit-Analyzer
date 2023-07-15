import React from "react";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <div className="container mt-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>JobFit Analyzer | About</title>
      </Helmet>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="card bg-light shadow p-4">
            <h1 className="mb-4">About</h1>
            <p className="text-justify">
              The Resume Matcher and Recommendation System is an innovative web
              application designed to help job seekers enhance their resume and
              evaluate its compatibility with specific job positions. By
              comparing the user's resume with a job description, the system
              calculates a match rate and provides personalized suggestions for
              resume improvement.
            </p>
            <p className="text-justify">
              Our goal is to assist job seekers in increasing their chances of
              securing interviews by optimizing their resumes and ensuring they
              align with the desired qualifications of employers.
            </p>
            <h2 className="mt-3">Features</h2>
            <ul>
              <li>
                Resume Matching: Upload your resume and enter a job description
                to compare qualifications and calculate a match rate.
              </li>
              <li>
                Resume Improvement Suggestions: Receive personalized suggestions
                to enhance your resume based on the comparison results.
              </li>
              <li>
                User Account: Create an account to save and access your previous
                resume history for easy reference.
              </li>
            </ul>
            <h2 className="mt-3">How It Works</h2>
            <ol>
              <li>Sign up or log in to your account(Optional).</li>
              <li>Upload your resume and enter a job description.</li>
              <li>
                Click on the "Start JobFit Analysis" button to see the match
                rate and resume improvement suggestions.
              </li>
              <li>
                Review the suggestions and make appropriate changes to your
                resume.
              </li>
              <li>
                Optionally, view your previous resume history by clicking on the
                "History" tab.
                <ul>
                  <li>
                    Note: You must log into your account to view the History
                    tab.
                  </li>
                </ul>
              </li>
            </ol>
            <hr className="my-4" />
            <p className="text-center mb-0">
              &copy; 2023 Uvaish Bakaliya. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
