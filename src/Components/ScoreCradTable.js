import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Table, Button } from 'react-bootstrap';
const ScorecardTable = () => {
  const [scorecards, setScorecards] = useState([]);
  const navigate=useNavigate()
 

  useEffect(() => {
    fetchScorecards();
  }, []);

  const fetchScorecards = () => {
    fetch('http://localhost:8000/api/scorecards/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch scorecards');
        }
        return response.json();
      })
      .then(data => {
        setScorecards(data);
      })
      .catch(error => {
        console.error('Error fetching scorecards:', error);
      });
  };



  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/scorecards/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete scorecard');
        }
        // Filter out the deleted scorecard from the current list
        const updatedScorecards = scorecards.filter(scorecard => scorecard.id !== id);
        setScorecards(updatedScorecards); // Update the state with the updated list
      })
      .catch(error => {
        console.error('Error deleting scorecard:', error);
      });
  };

  const handleEdit = (val) => {
    navigate(`/Update`, { state: { id:val } });
};



  return (
  
    <div className="scorecard-container">
      <Link to="/create" className="create-link">
        <Button className="mb-5"  variant="primary">Create Scorecard</Button>
      </Link>
      {scorecards.length === 0 && (
        <p>No Scorecard Found</p>
      )}
      {scorecards.length > 0 && (
        <div style={{padding:'0 40px 0 40px'}}>
           <Table striped bordered hover className="scorecard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {scorecards.map((scorecard, index) => (
              <tr key={index}>
                <td>{scorecard.title}</td>
                <td>
                  <Button variant="info" onClick={() => { handleEdit(scorecard.id) }}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(scorecard.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
          </div>
       
      )}
    </div>
  );
};

export default ScorecardTable;
