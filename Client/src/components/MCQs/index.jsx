import React from 'react';
import MCQQuestion from './MCQs';

function IndexMcqs() {
    const questions = [
        {
            question: 'What is Cyber Security?',
            options: [
                'Cyber Security provides security against malware',
                'Cyber Security provides security against cyber-terrorists',
                'Cyber Security protects a system from cyber attacks',
                'All of the mentioned',
            ],
            correctAnswer: 'All of the mentioned',
        },
        {
            question: 'What does cyber security protect?',
            options: [
                'Cyber security protects criminals',
                'Cyber security protects internet-connected systems',
                'Cyber security protects hackers',
                'None of the mentioned',
            ],
            correctAnswer: 'Cyber security protects internet-connected systems',
        },
    ];

    return (
        <div>
            <h1 style={{ display: 'flex', justifyContent: 'center' }}>Cyber Security MCQS</h1>

            {questions.map((q, index) => (
                <MCQQuestion
                    key={index}
                    question={q.question}
                    options={q.options}
                    correctAnswer={q.correctAnswer}
                />
            ))}
        </div>
    );
}

export default IndexMcqs;
