import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button, Form, Modal, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

const EditScoreCard = () => {
    const location = useLocation();
    const id = location.state ? location.state.id : null;
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [showAddOptionModal, setShowAddOptionModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [scoreCardName, setScoreCardName] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [error, setError] = useState({ name: '', score: '' });
    const [newQuestionName, setNewQuestionName] = useState("");
    const [newQuestionScore, setNewQuestionScore] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [newOption, setNewOption] = useState("");

    useEffect(() => {
        if (id) {
            fetchScorecardData();
        }
    }, [id]);

    const fetchScorecardData = () => {
        fetch(`http://localhost:8000/api/scorecards/${id}`)
            .then(response => response.json())
            .then(data => {
                setScoreCardName(data.title);
                setQuestions(data.questions);
                calculateTotalScore(data.questions);
            })
            .catch(error => console.error('Error fetching scorecard:', error));
    };

    const calculateTotalScore = (questionsData) => {
        let total = 0;
        questionsData.forEach(question => {
            total += question.score;
        });
        setTotalScore(total);
    };

    const handleCheckboxChange = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        const isChecked = updatedQuestions[questionIndex].correct.includes(updatedQuestions[questionIndex].options[optionIndex]);

        if (isChecked) {
            // If checked, remove from correct array
            updatedQuestions[questionIndex].correct = updatedQuestions[questionIndex].correct.filter(option => option !== updatedQuestions[questionIndex].options[optionIndex]);
        } else {
            // If not checked, add to correct array
            updatedQuestions[questionIndex].correct.push(updatedQuestions[questionIndex].options[optionIndex]);
        }

        setQuestions(updatedQuestions);
    };

    const handleAddOption = (questionIndex) => {
        setShowAddOptionModal(true);
        setCurrentQuestionIndex(questionIndex);
    };

    const handleDeleteQuestion = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(questionIndex, 1);
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        setShowAddQuestionModal(true);
    };

    const handleSubmitScorecard = () => {
        const data = {
            title: scoreCardName,
            questions: questions
        };

        fetch(`http://localhost:8000/api/scorecards/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if(response.ok) {
                displayToast("Scorecard updated successfully");
            } else {
                displayToast("Failed to update scorecard");
            }
        })
        .catch(error => console.error('Error updating scorecard:', error));
    };

    const handleQuestionSubmit = () => {
        const newQuestion = {
            text: newQuestionName,
            options: [],
            correct: [],
            score: parseInt(newQuestionScore),
            use_knowledge_base: false
        };

        setQuestions([...questions, newQuestion]);
        setShowAddQuestionModal(false);
        setNewQuestionName("");
        setNewQuestionScore("");
    };

    const handleOptionSubmit = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].options.push(newOption);
        setQuestions(updatedQuestions);
        setShowAddOptionModal(false);
        setNewOption("");
    };

    const displayToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <div className="min-vh-100">
            <Container>
                <Card style={{ marginTop: '20px', position: 'relative' }} className="shadow-sm p-4 rounded">
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                        <strong>Total Score:<span >{totalScore} </span> </strong>
                        <span style={{color:'red'}}>{error.score?error.score:''}</span>
                    </div>
                
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter scorecard name"
                                value={scoreCardName}
                                onChange={(e) => setScoreCardName(e.target.value)}
                            />
                        </div>
                        <span style={{color:'red',textAlign:'left'}}>{error.name?error.name:''}</span>
                    </div>
                    {/* questions */}
                    {questions.length === 0 && (
                        <div className="emptyQuestions">
                            <h4>No Questions Added</h4>
                        </div>
                    )}
                      <div>
                 {questions.map((item, questionIndex) => (
                        <div className="list" key={questionIndex}>
                           <div>
                           <div style={{marginBottom:'10px'}}>
                                <strong>{questionIndex+1}:{item.text}</strong>
                            </div>
                            
                            <div className="form-group">
                                {item.options.map((option, optionIndex) => {
                                    const isChecked = item.correct.includes(option);
                                    return (
                                        <div key={optionIndex}>
                                            <label className="option">
                                                <input className="custom-checkbox" type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange(questionIndex, optionIndex)} /> <span style={{marginLeft:'8px'}}>{option}</span>
                                            </label>
                                        </div>
                                    )
                                })}
                                <div style={{height:'10px'}}></div>
                                <span className="rounded-text-box" onClick={() => handleAddOption(questionIndex)}><FontAwesomeIcon style={{marginRight:'5px'}} icon={faPlus}/>add option</span>
                                <div style={{height:'10px'}}></div>
                            </div>
                           </div>
                            <div className="delete-container" onClick={(questionIndex) => handleDeleteQuestion(questionIndex)}><FontAwesomeIcon icon={faTrashCan}/></div>
                        </div>
                    ))}
                 </div>
                   
                    <div className="d-flex justify-content-end">
                        <span style={{paddingTop:'5px'}} className="me-2 rounded-text-box" onClick={handleAddQuestion}> <FontAwesomeIcon style={{marginRight:'5px'}} icon={faPlus}/>Add Question</span>
                        <span style={{paddingTop:'5px'}} className=" rounded-text-box" disabled={totalScore !== 100} onClick={handleSubmitScorecard}>Save Scorecard</span>
                    </div>
                </Card>
            </Container>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    minWidth: 200,
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>

            {/* Add Question Modal */}
            <Modal show={showAddQuestionModal} onHide={() => setShowAddQuestionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="questionName">
                        <Form.Label>Question Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter question name" value={newQuestionName} onChange={(e) => setNewQuestionName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="questionScore">
                        <Form.Label>Question Score</Form.Label>
                        <Form.Control type="number" placeholder="Enter question score" value={newQuestionScore} onChange={(e) => setNewQuestionScore(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddQuestionModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleQuestionSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Option Modal */}
            <Modal show={showAddOptionModal} onHide={() => setShowAddOptionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Option</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter an option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddOptionModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleOptionSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditScoreCard;
