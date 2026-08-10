// for React 18 remove styles
// import { withStyles } from '@mui/styles'; // <--- delete this ❌
import { styled } from '@mui/system'; // <--- Add this ✅
// material-ui components
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

// import log4javascript
import log4javascript from 'log4javascript';
window.log4javascript = log4javascript;

const styles = (theme) => ({
  eye: {
    cursor: 'pointer',
  },
});

export class UsernameInput extends Component {
  constructor(props) {
    super(props);
    this.log = log4javascript.getLogger('username_input_ctrl');
    this.state = { username: this.props.value };
    // add event handler
    if (typeof this.props.onChange === 'undefined') {
      this.handleChange = this.handleChange.bind(this);
    } else {
      this.handleChange = this.props.onChange;
    }
    if (typeof this.props.onKeyDown === 'undefined') {
      this.keyPress = this.keyPress.bind(this);
    } else {
      this.keyPress = this.props.onKeyDown;
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.log.debug('handleChange:', this.state.username);
  }

  keyPress(e) {
    if (e.keyCode == 13) {
      this.setState({ [e.target.name]: e.target.value });
      this.log.debug('keyPress:', this.state.username);
    }
  }

  render() {
    return (
      <TextField
        type="text"
        onKeyDown={this.keyPress}
        onChange={this.handleChange}
        // fullWidth={true}
        {...this.props}
      />
    );
  }
}

// UsernameInput.propTypes = {
//   // onKeyDown: PropTypes.func.isRequired,
//   // onChange: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired,
// };

// UsernameInput = styled(styles)(UsernameInput);
