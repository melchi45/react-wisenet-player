import React, { Component } from 'react';
// for React 18 remove styles
// import { withStyles } from '@mui/styles'; // <--- delete this ❌
import { styled } from '@mui/system'; // <--- Add this ✅
import {
    BsFillPlayFill,
    BsFillStopFill,
    BsFillPauseFill,
} from 'react-icons/bs';
import { IconContext, icons } from 'react-icons';

import styles from './styles/ControlBox.scss';
import './styles/Icons.scss';

import SvgDegree0 from './icons/SvgDegree0';
import SvgDegree90 from './icons/SvgDegree90';
import SvgDegree180 from './icons/SvgDegree180';
import SvgDegree270 from './icons/SvgDegree270';
import SvgVertivalFlip from './icons/SvgVerticalFlip';
import SvgHorizontalzFlip from './icons/SvgHorizontalFlip';
import SvgSeperate from './icons/SvgSeperate';

// import log4javascript
// import log4javascript from 'log4javascript';
// window.log4javascript = log4javascript;

export class Controller extends Component {
    constructor(props) {
        super(props);
        this.log = log4javascript.getLogger('password_input_ctrl');
    }

    render() {
        const {
            classes,
            playState,
            handlePlay,
            handleStop,
            handlePause,
            handleDegree0,
            handleDegree90,
            handleDegree180,
            handleDegree270,
            handleMirror,
            handleFlip,
        } = this.props;

        return (
            <div className={'controlbox'}>
                <div className={'rotate_control'}>
                    <IconContext.Provider
                        value={{
                            color: 'blue',
                            size: '48px',
                            className: 'global-class-name',
                        }}
                    >
                        <div>
                            <SvgDegree0
                                className={'grey icon padding link'}
                                onClick={handleDegree0}
                            />
                        </div>
                        <div>
                            <SvgDegree90
                                className={'grey icon padding link'}
                                onClick={handleDegree90}
                            />
                        </div>
                        <div>
                            <SvgDegree180
                                className={'grey icon padding link'}
                                onClick={handleDegree180}
                            />
                        </div>
                        <div>
                            <SvgDegree270
                                className={'grey icon padding link'}
                                onClick={handleDegree270}
                            />
                        </div>
                        <div>
                            <SvgSeperate className={'grey icon padding'}></SvgSeperate>
                        </div>
                        <div>
                            <SvgVertivalFlip
                                className={'grey icon padding link'}
                                onClick={handleMirror}
                            ></SvgVertivalFlip>
                        </div>
                        <div>
                            <SvgHorizontalzFlip
                                className={'grey icon padding link'}
                                onClick={handleFlip}
                            ></SvgHorizontalzFlip>
                        </div>
                    </IconContext.Provider>
                </div>
                <div className={'play_control'}>
                    <IconContext.Provider
                        value={{
                            color: 'blue',
                            size: '24px',
                            className: 'global-class-name',
                        }}
                    >
                        <BsFillPlayFill
                            className={
                                playState == 0 || playState == 2
                                    ? 'grey icon link'
                                    : 'grey icon disabled'
                            }
                            onClick={handlePlay}
                        />
                        <BsFillStopFill
                            className={
                                playState == 1 ? 'grey icon link' : 'grey icon disabled'
                            }
                            onClick={handleStop}
                        />
                        <BsFillPauseFill
                            className={
                                playState == 1 ? 'grey icon link' : 'grey icon disabled'
                            }
                            onClick={handlePause}
                        />
                    </IconContext.Provider>
                </div>
            </div>
        );
    }
}

// Controller.propTypes = {
//   // classes: PropTypes.object.isRequired,
//   // onKeyDown: PropTypes.func.isRequired,
//   // onChange: PropTypes.func.isRequired,
//   // value: PropTypes.string.isRequired,
// };

// Controller = styled(styles)(Controller);
