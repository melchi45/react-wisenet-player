import { useState, useEffect } from 'react';

const Devices = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // fetchAllPokemon().then(setData);
        fetch(chrome.runtime.getURL('/devices.json'))
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                chrome.storage.local.set({ devices: data.devices }, () => {
                    console.log('Value is set to ' + data.devices);
                    setData(data.devices);
                });

                chrome.storage.local.get('devices', function (data) {
                    //   var data = JSON.parse(devices.devices);
                    console.log(data.devices[0]);
                    this.device = data.devices[0];
                    //   setData(result.key);
                });
            });
    }, []);

    if (data.length === 0) return [];

    return data;
};

export default Devices;
