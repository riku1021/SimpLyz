import React, { useEffect, useState } from 'react';
import './Histogram.css';

function Histogram({ setImage }) {
  const [variable, setVariable] = useState('');
  const [target, setTarget] = useState('');
  const [variableList, setVariableList] = useState(['1', '2', '3']);
  const [targetList, setTargetList] = useState(['t1', 't2', 't3']);

  useEffect(() => {
    const fetchVariable = async () => {
      const response = await fetch('http://127.0.0.1:5000/get_quantitative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'a': 0}),
      });
      const data = await response.json()
      setVariableList(data['quantitative_variables'])
      setVariable(data['quantitative_variables'][0])
      console.log(data['quantitative_variables']);
    };
    const fetchTarget = async () => {
      const response = await fetch('http://127.0.0.1:5000/get_qualitative', {
        method: 'GET'
      })
      const data = await response.json()
      const targets = data['qualitative_variables']
      targets.push('None');
      setTarget('None')
      setTargetList(data['qualitative_variables'])
      console.log(data)
    }
    fetchTarget();
    fetchVariable();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      const sentData = {
        'variable': variable,
        'target': target
      }
      const response = await fetch('http://127.0.0.1:5000/hist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sentData),
      });
      const data = await response.json();
      setImage(data.image_data);
      console.log(data)
    };
    if (variable !== '' && target !== '') {
      fetchImage();
    }
    
  }, [variable, target, setImage]);

  const changeVariable = (e) => {
    setVariable(e.target.value);
  }

  const changeTarget = (e) => {
    setTarget(e.target.value);
  };
  return (
    <div>
      <div className='config-wrapper'>
        <div className='config-name-wrapper'>
          <p>variable</p>
        </div>
        <div className='config-value-wrapper'>
          <select value={variable} onChange={changeVariable} >
            {variableList && variableList.map((value, idx) => (
              <option key={idx} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='config-wrapper'>
        <div className='config-name-wrapper'>
          <p>target</p>
        </div>
        <div className='config-value-wrapper'>
          <select value={target} onChange={changeTarget} >
            {targetList && targetList.map((value, idx) => (
              <option key={idx} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Histogram
