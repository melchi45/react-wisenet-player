import React, { Component } from 'react';
// import { withStyles } from '@material-ui/core';
// import { Button } from '@mui/material';
// for React 18 remove styles
// import { withStyles } from '@mui/styles'; // <--- delete this ❌
import { styled } from '@mui/system'; // <--- Add this ✅
import { MdAccountBox } from 'react-icons/md';
import { IconContext, icons } from 'react-icons';

// Context Menu
import { Menu, MenuItem } from '@mui/base';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import styles from './styles/NavigationBar.scss';
import './styles/Icons.scss';

// import log4javascript
// import log4javascript from 'log4javascript';
// window.log4javascript = log4javascript;

export class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.log = log4javascript.getLogger('navigationbar_ctrl');
    }

    handleMenuItemClick(item, event, popupState) {
        console.log(item, event);
        popupState.close();
        item.task(event);
    }

    render() {
        const { classes, account, isLogin, menuData } = this.props;

        if (isLogin && account) {
            console.log('login');
            return (
                <div className="topNavigationBar">
                    <PopupState variant="popover" popupId="account-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <IconContext.Provider
                                    value={{
                                        color: 'blue',
                                        size: '16px',
                                        className: 'global-class-name',
                                    }}
                                >
                                    <MdAccountBox
                                        className={isLogin ? 'grey icon' : 'grey icon link'}
                                    />
                                    <div
                                        id="account_name"
                                        className="accountName"
                                        variant="contained"
                                        {...bindTrigger(popupState)}
                                    >
                                        {isLogin ? account.getUserId() : 'Login'}
                                    </div>
                                </IconContext.Provider>
                                <Menu {...bindMenu(popupState)} onClose={popupState.close}>
                                    {menuData.map((item) => (
                                        <MenuItem
                                            key={item.title}
                                            onClick={(event) =>
                                                this.handleMenuItemClick(item, event, popupState)
                                            }
                                        >
                                            {item.title}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>
                </div>
            );
        }

        return (
            <div className="topNavigationBar">
                <PopupState variant="popover" popupId="account-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <IconContext.Provider
                                value={{
                                    color: 'blue',
                                    size: '16px',
                                    className: 'global-class-name',
                                }}
                            >
                                <MdAccountBox
                                    className={isLogin ? 'grey icon' : 'grey icon link'}
                                />
                                <div
                                    id="account_login"
                                    className="accountName"
                                    variant="contained"
                                    {...bindTrigger(popupState)}
                                >
                                    {isLogin ? account.getUserId() : 'Login'}
                                </div>
                            </IconContext.Provider>
                            <Menu
                                {...bindMenu(popupState)}
                                MenuListProps={{
                                    'aria-labelledby': 'account_login',
                                }}
                            >
                                {menuData.map((item) => (
                                    <MenuItem
                                        key={item.title}
                                        onClick={(event) =>
                                            this.handleMenuItemClick(item, event, popupState)
                                        }
                                    >
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
        );
    }
}

// NavigationBar.propTypes = {
//   // classes: PropTypes.object.isRequired,
//   // onKeyDown: PropTypes.func.isRequired,
//   // onChange: PropTypes.func.isRequired,
//   // value: PropTypes.string.isRequired,
// };

// NavigationBar = styled(styles)(NavigationBar);
