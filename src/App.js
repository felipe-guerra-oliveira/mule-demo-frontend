import React, { useState,useEffect } from "react";
import './App.css';
import api from './api.js';
function App() {

  const [tweets,setTweets] = useState([]);
  const [maxResults, setMaxResults] = useState(10);
  const [analyticData,setAnalyticData] = useState([]);
  const resultsNumbers = [10, 25, 50, 100];
  
  useEffect(() => {
    
    let result = tweets.reduce((result, current) => {
      if (current.sentiment === null || current.sentiment === undefined)
        current.sentiment = 'UNKNOW';

      if(!result[current.sentiment]){
        result[current.sentiment] = { quantity: 0 };
      }
      result[current.sentiment].sentiment = current.sentiment;
      result[current.sentiment].quantity++;
      return result;
    }, {});

   setAnalyticData(result);

  },[tweets]);

  function handleLinesChange(num){
    setMaxResults(num);
  }

  function searchTweets(){
    api.get("/api/tweet", { params: { max_results: maxResults } })
      .then((response) => setTweets(response.data))
      .catch((err) => {
      alert("ops! ocorreu um erro" + err);
      });
  }

  function updateTweet(tweetId,payload){
    api.put('/api/tweet', payload, {params: { tweet_id: tweetId }}).then((response) => {
    
    }).catch((err) => {
      alert("ops! ocorreu um erro" + err);
      });
  }

  function getSentment(tweetId){
    api.get('/api/sentiment',{ params: { tweet_id: tweetId } }).then((response) => {
       var senti = response.data;

       for(var i = 0;i < tweets.length;i++){
          if (senti.id === tweets[i].id)
          {
            tweets[i].sentiment = senti.sentiment.result;
            updateTweet(tweetId,senti);
            setTweets([...tweets]);
          }
      }
    }).catch((err) => {
      alert("ops! ocorreu um erro" + err);
      });
  }

  return (
    <div className="App">
      <header>
            <button className="button-search" onClick={searchTweets}>SEARCH</button>
            <div>
            <strong>Lines</strong>
              <select onChange={(val) => handleLinesChange(val.target.value)}>
                {resultsNumbers.map((num) => 
                <option value={num}>{num}</option>
                )}
              </select>
              </div>
      </header>
      <div className='main-container'>
        <div className="dashboard">
    
            <span><img src="/positive.png" alt="Positive" width="16px" height="16px" /></span>
            <span>{analyticData['POSITIVE'] && <span>{analyticData['POSITIVE'].quantity}</span>}</span>

            <span><img src="/negative.png" alt="Negative" width="16px" height="16px" /></span>
            <span>{analyticData['NEGATIVE'] && <span>{analyticData['NEGATIVE'].quantity}</span>}</span>

            <span><img src="/NEUTRAL.png" alt="Neutral" width="16px" height="16px" /></span>
            <span>{analyticData['NEUTRAL'] && <span>{analyticData['NEUTRAL'].quantity}</span>}</span>
        
        </div>
        {tweets.map((tw ) => 
          <div className="card-main" data-id={tw.id}>
            <div className="card-header">
            <span className="card-tag">tag: #{tw.tag} - Sentiment</span>

            <span className="card-sentiment">
               
                {tw.sentiment === "NEGATIVE" && 
                <img src="/negative.png" alt="Negative" /> }
                {tw.sentiment === "POSITIVE" && 
                <img src="/positive.png" alt="Positive" /> }
                {tw.sentiment === "NEUTRAL" && 
                <img src="/neutral.png" alt="Neutral" /> }
            </span>
            </div>
            <hr></hr>
            <div className="card-text">
              <span>{tw.text}</span>
            </div>
            <hr></hr>
            <div className="card-footer">
              <button onClick={() => getSentment(tw.id)}>Sentiment</button>
            </div>  
          </div> 
          
          )}
      </div>
      <div>
        <strong >Tweets:</strong><span>{tweets.length}</span>
      </div>
    </div>
  );
}

export default App;