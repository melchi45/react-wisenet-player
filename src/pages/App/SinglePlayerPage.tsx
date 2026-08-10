import React, { useState, useEffect, Dispatch } from 'react';
import { useLocation } from 'react-router-dom';
// import { IDevice, SingleDevicesProps } from '../../components/ump-player/Constant/Constant';
import Player from '../../components/ump-player/Player';
// import device_local from '../../assets/json/device_1.json';

export const SinglePlayerPage: React.FC<SingleDevicesProps> = (props) => {
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      // Perform actions before the component unloads
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="player-block">
      <Player device={props.device} control={true} />
    </div>
  );
};