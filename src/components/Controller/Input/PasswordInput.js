import { InputAdornment, TextField } from '@mui/material';

// for React 18 remove styles
// import { withStyles } from '@mui/styles'; // <--- delete this ❌
import { styled } from '@mui/system'; // <--- Add this ✅

// import { InputAdornment, withStyles } from '@material-ui/core';
// import TextField from '@material-ui/core/TextField';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
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

export class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.log = log4javascript.getLogger('password_input_ctrl');
    this.state = { password: this.props.value, passwordIsMasked: true };
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
    this.log.debug('handleChange:', this.state.password);
  }

  keyPress(e) {
    if (e.keyCode == 13) {
      this.setState({ [e.target.name]: e.target.value });
      this.log.debug('keyPress:', this.state.password);
    }
  }

  togglePasswordMask = () => {
    this.setState((prevState) => ({
      passwordIsMasked: !prevState.passwordIsMasked,
    }));
  };

  render() {
    const { classes } = this.props;
    const { passwordIsMasked } = this.state;

    return (
      <TextField
        type={passwordIsMasked ? 'password' : 'text'}
        onKeyDown={this.keyPress}
        onChange={this.handleChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <RemoveRedEyeIcon
                className={classes.eye}
                onClick={this.togglePasswordMask}
              />
            </InputAdornment>
          ),
        }}
        {...this.props}
      />
    );
  }
}

// PasswordInput.propTypes = {
//   classes: PropTypes.object.isRequired,
//   // onKeyDown: PropTypes.func.isRequired,
//   // onChange: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired,
// };

// PasswordInput = styled(styles)(PasswordInput);
