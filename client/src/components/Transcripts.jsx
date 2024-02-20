import React, { useEffect, useState } from 'react';
import "../App.css"
const Transcripts = ({ sessionId }) => {
  const [transcriptList, setTranscriptList] = useState([]);

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    try {
      const response = await fetch(`rest/fetch-transcript/${sessionId}`);
      const data = await response.json();
      setTranscriptList(data.results);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    }
  };

  return (
    <section className="middle-sections hide" id="transcripts">
      <h3 className="dash-head">Transcripts</h3>
      <div id="transcriptList">
        {/* Render transcript data here */}
        {transcriptList.length === 0 ? (
          <h4 className="dash-head" style={{ fontWeight: '500', marginTop: '40px' }}>
            <i>No Transcripts found!</i>
          </h4>
        ) : (
          <>
            <h4 className="dash-head" style={{ fontWeight: '500' }}>
              <i>Product Name: {transcriptList[0].sessionId.productName}</i>
            </h4>
            <h4 className="dash-head" style={{ fontWeight: '500' }}>
              <i>Name: {transcriptList[0].sessionId.name}</i>
            </h4>
            <h4 className="dash-head" style={{ fontWeight: '500' }}>
              <i>Email: {transcriptList[0].sessionId.email}</i>
            </h4>
            <table id="transtable" className="display borderless" style={{ width: '100%' }}>
              {/* Render table headers here */}
              <thead>
                <tr>
                  <th style={{ opacity: 0 }}>Trancripts</th>
                </tr>
              </thead>
              <tbody>
                {transcriptList.map((transcript) => (
                  <tr key={transcript._id}>
                    {/* Render transcript data here */}
                    <td>
                      {transcript.type === 1 ? (
                        <i>Answer </i>
                      ) : (
                        <i>Query </i>
                      )}
                      [{' '}
                      {new Date(transcript.date).toLocaleString().split(' ')[1]}] {transcript.transcript}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default Transcripts;
