import { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const Applications = () => {
  // Mock Data
  const [applications, setApplications] = useState([
    { id: 101, studentName: 'Alice Johnson', email: 'alice@example.com', internshipTitle: 'Frontend Developer React', status: 'Pending' },
    { id: 102, studentName: 'Bob Smith', email: 'bob@example.com', internshipTitle: 'Backend Node.js Engineer', status: 'Accepted' },
    { id: 103, studentName: 'Charlie Brown', email: 'charlie@example.com', internshipTitle: 'Frontend Developer React', status: 'Pending' },
    { id: 104, studentName: 'Diana Prince', email: 'diana@example.com', internshipTitle: 'UI/UX Designer', status: 'Rejected' },
  ]);

  const updateStatus = (id, newStatus) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Accepted': return <span className="badge badge-success">{status}</span>;
      case 'Rejected': return <span className="badge badge-danger">{status}</span>;
      default: return <span className="badge badge-warning">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Applications</h1>
      </div>

      <Card>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Details</th>
                <th>Applied Role</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div><strong>{app.studentName}</strong></div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.email}</div>
                  </td>
                  <td>{app.internshipTitle}</td>
                  <td>
                    <button style={{ color: '#3b82f6', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>View Resume</button>
                  </td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    {app.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="success" onClick={() => updateStatus(app.id, 'Accepted')}>Accept</Button>
                        <Button variant="danger" onClick={() => updateStatus(app.id, 'Rejected')}>Reject</Button>
                      </div>
                    )}
                    {app.status !== 'Pending' && (
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Action completed</span>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No applications received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
