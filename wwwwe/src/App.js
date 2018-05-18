import React, { Component } from 'react';

import { DB_CONFIG } from "./Config/Config";

import * as firebase from "firebase";

// import logo from './logo.svg';
import './App.css';


// function AddOptions(props) {

//     // var i;
//     // var text;
//     // for(i = 0; i < props.numSlots; i++)
//     // {
//     //   text += "<div> <input></input> </div>";
//     // }


//     // return text;

//     return <div> <input></input> </div>;

// }


class Options extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPolls: props.poll
    }

    this.mapClass = this.mapClass.bind(this);
  }

  mapClass() {

    var current = this.state.currentPolls[1];

    var options = this.props.poll[0].options;
    console.log("OPS", this.props.poll);
    console.log("options?", this.props.poll[0].options)

    // return (options.map((ops) =>
    //   <p>{ops}</p>)
    //   )

  }

  render() {
    return (<div>{this.mapClass()}</div>);



  }


}
class App extends Component {

  constructor(props) {
    super(props);

    var admin = require('firebase-admin');


    this.firebase = require("firebase");
    require("firebase/firestore");

    if (!this.firebase.apps.length) {
        console.log("Initializing DB for first time...");
        this.firebase.initializeApp(DB_CONFIG);
      } else {
        console.log("DB already initialized.");
      }

    this.db = this.firebase.firestore();

    this.createPoll = this.createPoll.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.add = this.add.bind(this);
    this.addOption = this.addOption.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.getActivePolls = this.getActivePolls.bind(this);
    //this.saveOptions = this.saveOptions.bind(this);
    this.state =
    {
      pollname: '',
      currentPolls: [{}],
      numSlots: 0,
      options: [{}],
      selectedPoll: {},
      active: [],
      loading: true
    }


  }  

  componentWillMount() {
    this.getActivePolls();
    this.setState({loading: false})
  }


  getActivePolls() {
    var active = [{}];
    var query = this.db.collection("activePolls").where("active","==", true);
    query.onSnapshot((snap) => {
      var act = [];
      snap.forEach((doc) => {
        if(doc.exists) {
          var pollname = doc.data().pollname;

          active.push(pollname);
          console.log("ACTive", this.state.active);
          this.setState({active: active});
        }
      })
    })
    console.log("??");

    // query.get().then(doc => {
    //   if(doc.exists)
    //   {
    //     active = doc.data();

    //   }
    //   else{console.log("nops");}
    // }).then(() =>
    // console.log("ACt", active));

  }


  handleChange(e) {
    this.setState({pollname: e.target.value});
    console.log(this.state.pollname);
  }

  handleOptionChange(e) {

    var options = this.state.options;
    options[this.state.numSlots] = e.target.value;
    this.setState({options: options});
    console.log("Ops", this.state.options);
  }

  createPoll() {

    var poll = {pollname: this.state.pollname,
    options: this.state.options,
    active: true}
    console.log("POLL", poll);

    var query = this.db.collection("activePolls").doc(this.state.pollname);
    query.get().then(doc => {
      query.set(poll);
      alert("ok submitted?");
    })


    console.log("ok whats up");

    
    // var updatedPolls = this.state.currentPolls;
    // updatedPolls.push(poll);
    // this.setState({currentPolls: updatedPolls});
    // console.log("poll",this.state.currentPolls);

  }

  add() {
    this.setState({numSlots: this.state.numSlots + 1});
    console.log("NUMBER", this.state.numSlots);
  }

  addOption = () => {
    this.setState({
      options: this.state.options.concat([{}]),
      numSlots: this.state.numSlots + 1,
    });

    console.log("YES", this.state.options);
  }

  // saveOptions() {
  //   var temp = {
  //     name: this.state.pollname,
  //     options: this.state.options
  //   }

  //   var current = this.state.currentPolls;
  //   current.push(temp);

  //   this.setState = {
  //     currentPolls: temp,
  //   }

  //   console.log("Save");

  // }



  render() {
    if(this.state.loading === false)
    {
      return (

        <div className="App">
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <h1 className="App-title">WWWWWWWE</h1>
          </header>
          <div id="new-poll">
            <h2 className="App-intro">
              Start a New Poll
            </h2>
            <div>
            Pollname 
              <textarea
                onChange={this.handleChange}>
                {this.state.pollname}
              </textarea>
              {this.state.options.map((op,indx) => (
                <div className="poll-input">
                option {indx + 1} <input onChange={this.handleOptionChange}/></div>
                ))}
              <button onClick={this.addOption}> add option </button>

              <button id="submit-button" onClick={this.createPoll}>
                Submit
              </button>
            </div>
          </div>
          <div id="all-polls">

             {this.state.active.map((polls) => {
               console.log("polls",polls);
               <p>{polls}</p>
             })}



              </div>  
              

        </div>
      );
    }
    else{
      return null;
    }
    
  }
}

export default App;