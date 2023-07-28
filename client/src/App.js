//scss file where we have declared css for different class
import './App.css';
//here I have used antd design for getting styled component of react and other dependencies
import { Button,Form,Input,Row, Col, notification } from 'antd';
import { useState,React } from 'react';
import moment from 'moment'
import axiosInstance from './axios_instance';

function App() {
  //all required state and setStates(holds the updated state) are declared below
	const size = 'large'
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stockData, setStockData] = useState({})
  const [inputValue, setInputvalue] = useState('')
  const [showCard, setShowCard] = useState("none")
  let separator = '-';
  //dateformat should match what is given in polygon api
  const dayFormat = ['YYYY', 'MM', 'DD'].join(separator);

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const CurrentDate = (e) => {
    setSelectedDate(e.target.value)
  };
//openotification for showing alert success/error message
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Stock details fetched successfully!',
    });
  };
  const openNotificationWithError = (error) => {
    notification['error']({
      message: error
    });
  };

//axios post call by passing ticker symbol and date for what we want stock details and then setting response in state with error handling
  const fetchStockData = () => {
    axiosInstance.post('/api/fetchStockData',{
          symbol: inputValue,
          date: moment(selectedDate).format(dayFormat)
       })
        .then((response) => {
            if(response.status === 200){
              openNotificationWithIcon('success')
              setStockData(response.data) //add response data in state
              setShowCard('block')
              //show stock details section only when success response occured
            }
        })
        .catch((error) => {
          openNotificationWithError(error.response.data.error)
          setShowCard('none')
           //dont show stock details section when error response occured
        })
  };
//Below is UI of stock details
  return (
    <div className="App">
      <header className="App-header">
        <h1>Trade Statistics Analysis</h1>
        <div className="main-div" style={{marginTop:"0.5rem", border:"1px solid white", minWidth:"350px", padding:'1rem'}}>
          <Form onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" form={form}>
            <Row>
              <Col span={12} className='gutter-row' style={{padding:'0 12px 0 0'}}>
                <Form.Item rules={[{required: true,message: 'Please Enter Symbol of Stock!'},]}>
                  <Input placeholder="Enter the Symbol of Stock" value={inputValue} onChange={(e) => setInputvalue(e.target.value)}/>
                </Form.Item>
              </Col>
              <Col span={12} className='gutter-row' style={{padding:'0 0 0 12px'}}>
              <Form.Item rules={[{required: true,message: 'Please Enter Symbol of Stock!'},]}>
                <Input onChange={CurrentDate} value={selectedDate} type="date" id="birthday" name="birthday"/>
              </Form.Item>
              </Col>
            </Row>
            <Row style={{justifyContent:'center'}} >
              <Button style={{backgroundColor:'blue',color:'white'}} htmlType='submit' shape="round" size={size} onClick={fetchStockData} disabled={!selectedDate || !inputValue}>
                Submit
              </Button>
            </Row>
          </Form>
        </div>
        <div className="detail-card" style={{display: showCard}}>
          <Row>
            <div className='row'><u>Trade Statistics for <b>{inputValue || '-'}</b></u></div>
          </Row>
          <Row style={{marginTop:'16px'}}>
            <Col span={12} className='gutter-row' style={{padding:'0 12px 0 0'}}>
              <b>Open</b>: {stockData?.open}
            </Col>
            <Col span={12} className='gutter-row' style={{padding:'0 0 0 12px'}}>
              <b>Close</b>: {stockData?.close}
            </Col>
          </Row>
          <Row style={{marginTop:'8px'}}>
            <Col span={12} className='gutter-row' style={{padding:'0 12px 0 0'}}>
              <b>High</b>: {stockData?.high}
            </Col>
            <Col span={12} className='gutter-row' style={{padding:'0 0 0 12px'}}>
              <b>Low</b>: {stockData?.low}
            </Col>
          </Row>
          <Row style={{marginTop:'8px'}}>
            <Col span={12} className='gutter-row'>
              <b>Volume</b>: {stockData?.volume}
            </Col>
          </Row>
          
        </div>
      </header>
    </div>
  );
}

export default App;