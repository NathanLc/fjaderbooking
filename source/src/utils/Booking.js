'use strict';

const Booking = args => {
  const errorGeneric = 'Error while creating Booking: ';
  if (!args.timespan) {
    throw new Error(errorGeneric, 'timespan is missing');
  }
  if (!args.field) {
    throw new Error(errorGeneric, 'field is missing');
  }
  if (!args.value) {
    throw new Error(errorGeneric, 'value is missing');
  }

  const startEnd = args.timespan.split('-');
  const start = startEnd[0];
  const end = startEnd[1];

  return {
    start: start,
    end: end,
    timespan: args.timespan,
    field: args.field,
    value: args.value
  };
};

module.exports = Booking;
