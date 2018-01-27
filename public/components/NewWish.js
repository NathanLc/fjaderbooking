'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import app from '../app';

const NewWishForm = props => (
    <form onSubmit={props.onSubmitNewWish}>
      <div className="form-group">
        <label htmlFor="day">Day</label>
        <input type="date" name="day" className="form-control" onChange={props.onUpdateDay} value={props.day} />
      </div>
      <div className="form-group">
        <label htmlFor="after">After</label>
        <input type="time" name="after" className="form-control" onChange={props.onUpdateAfter} value={props.after} />
      </div>
      <div className="form-group">
        <label htmlFor="before">Before</label>
        <input type="time" name="before" className="form-control" onChange={props.onUpdateBefore} value={props.before} />
      </div>
      <div className="form-group">
        <p>Floor</p>
        <div className="form-check">
          <label className="form-check-label">
            <input type="radio" className="form-check-input" name="floor" value="upstairs" onChange={props.onUpdateFloor} checked={props.floor === 'upstairs'} /> Upstairs
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input type="radio" className="form-check-input" name="floor" value="anywhere" onChange={props.onUpdateFloor} checked={props.floor === 'anywhere'} /> Anywhere
          </label>
        </div>
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={props.onCancelNewWish} >Cancel</button>
      </div>
    </form>
);
NewWishForm.propTypes = {
  day: PropTypes.string.isRequired,
  onUpdateDay: PropTypes.func.isRequired,
  after: PropTypes.string.isRequired,
  onUpdateAfter: PropTypes.func.isRequired,
  before: PropTypes.string.isRequired,
  onUpdateBefore: PropTypes.func.isRequired,
  floor: PropTypes.string.isRequired,
  onUpdateFloor: PropTypes.func.isRequired,
  onSubmitNewWish: PropTypes.func.isRequired,
  onCancelNewWish: PropTypes.func.isRequired
};

class NewWish extends React.Component {
  constructor (props) {
    super(props);

    const now = moment();

    this.state = {
      day: now.format('YYYY-MM-DD'),
      after: now.format('HH:mm'),
      before: now.format('HH:mm'),
      floor: 'upstairs'
    };

    this.handleUpdateDay = this.handleUpdateDay.bind(this);
    this.handleUpdateAfter = this.handleUpdateAfter.bind(this);
    this.handleUpdateBefore = this.handleUpdateBefore.bind(this);
    this.handleUpdateFloor = this.handleUpdateFloor.bind(this);
    this.handleSubmitNewWish = this.handleSubmitNewWish.bind(this);
  }

  handleUpdateDay (e) {
    this.setState({
      day: e.target.value
    });
  }

  handleUpdateAfter (e) {
    this.setState({
      after: e.target.value
    });
  }

  handleUpdateBefore (e) {
    this.setState({
      before: e.target.value
    });
  }

  handleUpdateFloor (e) {
    this.setState({
      floor: e.target.value
    });
  }

  handleSubmitNewWish (e) {
    e.preventDefault();

    app.service('wishes').create(Object.assign({}, this.state))
      .catch(err => { console.warn('Error while creating wish: ', err); });
  }

  render () {
    return (
      <NewWishForm
        day={this.state.day}
        onUpdateDay={this.handleUpdateDay}
        after={this.state.after}
        onUpdateAfter={this.handleUpdateAfter}
        before={this.state.before}
        onUpdateBefore={this.handleUpdateBefore}
        floor={this.state.floor}
        onUpdateFloor={this.handleUpdateFloor}
        onSubmitNewWish={this.handleSubmitNewWish}
        onCancelNewWish={this.props.releaseFocus} />
    );
  }
};
NewWish.propTypes = {
  releaseFocus: PropTypes.func.isRequired
};

export default NewWish;
