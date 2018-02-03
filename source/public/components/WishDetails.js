'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const BookingInfo = props => {
  const booking = props.booking;

  return (
      <div className="card-block">
        <h6 className="card-title">Booking</h6>
        <p className="card-text">{booking.timespan}, field {booking.field}.</p>
      </div>
  );
};
BookingInfo.propTypes = {
  booking: PropTypes.object.isRequired
};

const WishDetails = props => {
  const wish = props.wish;
  const bookingInfo = wish.booking
    ? <BookingInfo booking={wish.booking} />
    : <div></div>;

  return (
    <div className="card">
      <h5 className="card-header">{wish.day} <small>{wish.timespan}</small></h5>
      <div className="card-block">
        <p className="card-text">Lorem ipsum dolor sit amet...</p>
        <p className="card-text">Lorem ipsum dolor sit amet...</p>
      </div>
      {bookingInfo}
    </div>
  );
};
WishDetails.propTypes = {
  wish: PropTypes.object.isRequired
};

export default WishDetails;
