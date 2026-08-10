import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { Switch } from '../../components/Sidebar/Switch';
import { SidebarHeader } from '../../components/Sidebar/SidebarHeader';
import { Diamond } from '../../components/Sidebar/icons/Diamond';
import { BarChart } from '../../components/Sidebar/icons/BarChart';
import { Global } from '../../components/Sidebar/icons/Global';
import { InkBottle } from '../../components/Sidebar/icons/InkBottle';
import { Book } from '../../components/Sidebar/icons/Book';
import { Calendar } from '../../components/Sidebar/icons/Calendar';
import { ShoppingCart } from '../../components/Sidebar/icons/ShoppingCart';
import { Service } from '../../components/Sidebar/icons/Service';
import { SidebarFooter } from '../../components/Sidebar/SidebarFooter';
import { Badge } from '../../components/Sidebar/Badge';
import { Typography } from '../../components/Sidebar/Typography';
import { PackageBadges } from '../../components/Sidebar/PackageBadges';
import { SinglePlayerPage } from './SinglePlayerPage';
import { MultiPlayerPage } from './MultiPlayerPage';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { DeviceTable } from '../../components/Controller/Table/DeviceTable';
import { RestClientConfig } from '../../components/ump-player/sunapi/RestClientConfig';
import {
  IDevice,
  ISearchDevice,
  ResetClientProps,
  deviceTypeOptions,
  deviceChannelOptions,
  IInitializedData,
  IAttributesData,
} from '../../components/ump-player/Constant/Constant';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// Button icons
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


import { SunapiManager } from '../../components/ump-player/sunapi/SunapiManager';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

const RESTCLIENT_CONFIG = RestClientConfig;
const discoveryApp = null;
const discoveryAppIds = RESTCLIENT_CONFIG.discoveryAppId;
const isSupportDiscoveryApp = false;

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Playground: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [deviceTable, showDeviceTable] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [searchDevices, addNewDevice] = useState<ISearchDevice[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<IDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<IDevice>({
    id: "ump-player-1",
    hostname: "",
    port: 0,
    username: "",
    profile: "H.264",
    channel: 1,
    device: "camera",
    password: "",
    autoplay: true,
    statistics: false,
    https: false
  });
  const [useDefault, setDefailt] = useState(true);
  const [defaultUsername, setDefaultUsername] = useState("admin");
  const [defaultPassword, setDefaultPassword] = useState("5tkatjd!");

  useEffect(() => {
    //get all contents of chrome storage
    chrome.storage.local.get(null, function (obj) {
      // console.log("Read content data of chrome storage => " + JSON.stringify(obj));
      if (obj && obj.device) {
        setSelectedDevice(obj.device);
        // console.log(selectedDevice);
      }
      if (obj && obj.devices) {
        setSelectedDevices(obj.devices);
        // console.log(selectedDevices);
      }
    });

    if (typeof chrome !== 'undefined') {
      if (chrome.storage) {
        //Set some content from background page
        // chrome.storage.local.set({ "identifier": "Some awesome Content" }, function () {
        //     console.log("Storage Succesful");
        // });
        //get all contents of chrome storage
        chrome.storage.local.get(null, function (obj) {
          // console.log("Read content data of chrome storage => " + JSON.stringify(obj));
        });
      }
      if (chrome.runtime && chrome.runtime.onMessageExternal) {
        try {
          // discoveryApp = chrome.runtime.connect(discoveryAppIds);
          // isSupportDiscoveryApp = true;
          chrome.runtime.connect(discoveryAppIds);
          if (chrome.runtime.onMessageExternal) {
            chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
              if (message.launch == true) {
                // console.log("sender" + JSON.stringify(sender));
              } else {
                // console.log("sender" + JSON.stringify(sender));
                // console.log("message" + JSON.stringify(message));
                // console.log("message" + devices.length);ÿ
                const strMacAddress: string = message.chMac.replace('ÿ', '');
                const strIpAddress: string = message.chIP.replace('ÿ', '');
                const strModel: string = message.chDeviceNameNew !== '' ? message.chDeviceNameNew : message.chDeviceName;
                const numType: number = message.modelType;
                const numPort: number = message.nPort;
                const numHttpType: boolean = (message.httpType != undefined) ? (message.httpType ? true : false) : false;
                const numHttpPort: number = message.nHttpPort === 0 ? 80 : message.nHttpPort;
                const numHttpsPort: number = message.nHttpsPort === 0 ? 443 : message.nHttpsPort;
                const strGateway: string = message.chGateway.replace('ÿ', '');;
                const strSubnetMask: string = message.chSubnetMask.replace('ÿ', '');;
                const boolSunapiSupport: boolean = message.isSupportSunapi == 1 ? true : false;
                const strDDNS: string = message.DDNSURL;
                const separator: string = '_';
                const strId: String = [strMacAddress, strIpAddress].join(separator);
                // const Id: number = searchDevices.length + 1;

                // const updatedRows = [...searchDevices];
                // const rowIndex = searchDevices.findIndex((row) => row.id === strId);
                // updatedRows[rowIndex];

                const newDevice: ISearchDevice = {
                  id: strId,
                  Model: strModel,
                  Type: numType,
                  Username: "",
                  Password: "",
                  IPAddress: strIpAddress,
                  MACAddress: strMacAddress,
                  Port: numPort,
                  Channel: 1, // 1 is default value
                  MaxChannel: 1, // 1 is default value
                  HttpType: numHttpType,
                  HttpPort: numHttpPort,
                  HttpsPort: numHttpsPort,
                  Gateway: strGateway,
                  SubnetMask: strSubnetMask,
                  SupportSunapi: boolSunapiSupport,
                  URL: strDDNS
                };
                fetchDevices(newDevice, 0);
              }
            });
          }

          if (chrome.management) {
            chrome.management.get(discoveryAppIds, (info) => {
              console.log("get App Info:\r\n" + JSON.stringify(info));
              if (info && !info.enabled && info.id === discoveryAppIds) {
                chrome.management.setEnabled(discoveryAppIds, false, function () {
                  chrome.management.setEnabled(discoveryAppIds, true);
                });
              } else {
                chrome.management.launchApp(discoveryAppIds, function () {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                  } else {
                    console.log("Discovery App launched");
                  }
                });
                chrome.runtime.sendMessage(discoveryAppIds, {
                  window: false,
                  discovery: true
                });
              }
            });
            chrome.management.onEnabled.addListener(function (info) {
              console.log("App onEnabled:\r\n" + JSON.stringify(info));
              if (info.id === discoveryAppIds) {
                console.log("Discovery app is enabled!");
              }
            });
            chrome.management.onDisabled.addListener(function (info) {
              console.log("App onDisabled:\r\n" + JSON.stringify(info));
            });
          }

        } catch (error) {
          console.error("Not support the discovery with chrome app:" + error);
        }
      }
    }
  }, []);

  const fetchDevices = (newDevice: ISearchDevice, from: Number) => {
    addNewDevice((searchDevices) => {
      // const sameDevices = searchDevices.filter((device) => device.id === newDevice.id);
      const rowIndex = searchDevices.findIndex((row) => row.id === newDevice.id);
      // replace old value from DeviceTable
      if (rowIndex > 0) {
        if (from === 0) {
          // if (searchDevices[rowIndex].Username !== "") {
          //     newDevice.Username = searchDevices[rowIndex].Username;
          // }
          // if (searchDevices[rowIndex].Password !== "") {
          //     newDevice.Password = searchDevices[rowIndex].Password;
          // }
          // if(searchDevices[rowIndex].HttpType) {
          //     searchDevices[rowIndex].Port = searchDevices[rowIndex].HttpPort
          // }
          // newDevice.HttpType = searchDevices[rowIndex].HttpType;
          // newDevice.HttpPort = searchDevices[rowIndex].HttpPort;
          // newDevice.HttpsPort = searchDevices[rowIndex].HttpsPort;
        } else {
          if (useDefault) {
            if (!checkValue(newDevice.Username)) {
              newDevice.Username = defaultUsername;
            }
            if (!checkValue(newDevice.Password)) {
              newDevice.Password = defaultPassword;
            }
          }
          searchDevices[rowIndex].Username = newDevice.Username;
          searchDevices[rowIndex].Password = newDevice.Password;
          searchDevices[rowIndex].MaxChannel = newDevice.MaxChannel;
          searchDevices[rowIndex].Channel = newDevice.Channel;
          searchDevices[rowIndex].HttpType = newDevice.HttpType;
          searchDevices[rowIndex].HttpPort = newDevice.HttpPort;
          searchDevices[rowIndex].HttpsPort = newDevice.HttpsPort;
          if (searchDevices[rowIndex].HttpType) {
            searchDevices[rowIndex].Port = newDevice.HttpsPort;
          } else {
            searchDevices[rowIndex].Port = newDevice.HttpPort;
          }
        }

        return searchDevices;
      }
      const filteredDevices = searchDevices.filter((device) => device.id !== newDevice.id);
      return [...filteredDevices, newDevice];
    });
    // const filteredDevices = searchDevices.filter((device) => device.MACAddress === newDevice.MACAddress);
    // if (filteredDevices.length <= 0) {
    //     // return [...filteredDevices, newDevice];
    //     addNewDevice((searchDevices) => [...searchDevices, newDevice]);
    // }

    // if (!searchDevices.find((device) => device.id === newDevice.id)) {
    //     console.log(newDevice);
    //     addNewDevice((searchDevices) => [...searchDevices, newDevice]);
    // }
  };

  const connectSunapi = async (device: ISearchDevice): Promise<ISearchDevice> => {
    return new Promise(resolve => {
      // Assuming the deviceTypeOptions array is defined as in your previous message
      // Use the find method to get the object with value 0
      let option = deviceTypeOptions.find(obj => obj.value === device.Type);
      let https = (device.HttpType !== undefined && device.HttpType === true);
      // create an object that conforms to the interface
      const client: ResetClientProps = {
        ClientIPAddress: '127.0.0.1',
        cameraIp: device.IPAddress !== undefined ? device.IPAddress : '',
        captureName: 'test',
        username: device.Username !== undefined ? device.Username : '',
        password: device.Password !== undefined ? device.Password : '',
        port: device.Port !== undefined ? device.Port : 0,
        https: https,
        protocol: https ? 'https' : 'http',
        hostname: device.IPAddress !== undefined ? device.IPAddress : '',
        deviceType: option !== undefined ? option.type : '',
        serverType: 'grunt',
        timeout: 1000,
        debug: true,
        async: false
      };
      if (device.SupportSunapi &&
        (client.cameraIp !== undefined && client.cameraIp !== '') &&
        (client.username !== undefined && client.username !== '') &&
        (client.password !== undefined && client.password !== '')) {
        let sunapimanager = new SunapiManager();
        sunapimanager.init(client)
          .then((data: IInitializedData) => {
            // console.log(window.fastJsonStringfy(data));
            if (data.Initialized) {
              var result = deviceChannelOptions.filter((item) => item.value <= data.MaxChannel);
              device.MaxChannel = data.MaxChannel;
              // const columnDef: GridColDef[] = columns.filter(column => column.field === "Channel");
              // columnDef[0].valueOptions = result;
              // columnDef[0].editable = true;
              // columnDef[0].type = 'singleSelect';
              // handleUpdateDevice(response, 1);

              // sunapimanager.getAttributes().then((attributes: IAttributesData) => {
              //   console.log(attributes);
              // });

              resolve(device);
            }
          })
          // Use .catch() to handle the rejection of any promise
          .catch((error) => {
            // Use the error
            console.error(error); // Error: Something went wrong
          });
      }
    });
  };

  // handle on RTL change event
  const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtl(e.target.checked);
  };

  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const handleDeviceTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    showDeviceTable(e.target.checked);
  };

  const useDefaultAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefailt(e.target.checked);
  };

  const navigate = useNavigate();

  const handleSecureModeChanged = (changedDevice: ISearchDevice) => {
    // fetchDevices(changedDevice);
    // console.log(JSON.stringify(changedDevice));
  }

  const checkValue = (value: String | null | undefined) => {
    if (value == null) return false;
    if (value == undefined) return false;
    if (!value.trim()) return false;
    if (value === "") return false;
    if (value === defaultUsername || value === defaultPassword) return true;

    return true;
  }

  const asyncMain = async (device: ISearchDevice): Promise<ISearchDevice> => {
    let result = await connectSunapi(device);
    console.log(JSON.stringify(result));
    fetchDevices(result, 1);
    const newDevice: IDevice = {
      id: "ump-player-1",
      hostname: result.IPAddress,
      port: result.Port,
      username: result.Username,
      profile: "H.264",
      channel: result.Channel,
      device: "camera",
      password: result.Password,
      autoplay: true,
      statistics: true,
      https: result.HttpType
    };
    if (selectedDevice.username !== newDevice.username ||
      selectedDevice.port !== newDevice.port ||
      selectedDevice.password !== newDevice.password ||
      selectedDevice.hostname !== newDevice.hostname ||
      selectedDevice.channel !== newDevice.channel ||
      selectedDevice.https !== newDevice.https) {
      // set device information
      setSelectedDevice(newDevice);
    }
    navigate("singleplayer", { state: { device: selectedDevice } });
    //Set some content from background page
    chrome.storage.local.set({ device: selectedDevice }, function () {
      console.log("Storage Succesful");
    });
    //get all contents of chrome storage
    chrome.storage.local.get(null, function (obj) {
      console.log("Read content data of chrome storage => " + JSON.stringify(obj));
    });

    return result;
  };

  const onSelectedDevice = (device: ISearchDevice) => {
    if (useDefault) {
      if (!checkValue(device.Username)) {
        device.Username = defaultUsername;
      }
      if (!checkValue(device.Password)) {
        device.Password = defaultPassword;
      }
    }

    if (device.Username !== "" && device.Password !== "") {
      let result = asyncMain(device);
    }
  }

  const onSelectedDevices = (devices: ISearchDevice[]) => {
    if (devices.length > 1) {
      let newDevices: IDevice[] = [];
      let offset = 1;
      devices.forEach((element: ISearchDevice, index: Number) => {
        let maxChannel = element.MaxChannel as number;
        if (maxChannel > 1) {
          for (let i = 0; i < maxChannel; i++) {
            let channel = i + 1;
            const newDevice: IDevice = {
              id: "ump-player-" + element.IPAddress + "-" + index + "-" + channel,
              hostname: element.IPAddress,
              port: element.Port,
              username: element.Username,
              profile: "H.264",
              channel: channel,
              device: "camera",
              password: element.Password,
              autoplay: true,
              statistics: false,
              https: element.HttpType
            };
            newDevices.push(newDevice);
          }
        } else {
          const newDevice: IDevice = {
            id: "ump-player-" + element.IPAddress + "-" + index,
            hostname: element.IPAddress,
            port: element.Port,
            username: element.Username,
            profile: "H.264",
            channel: element.Channel,
            device: "camera",
            password: element.Password,
            autoplay: true,
            statistics: false,
            https: element.HttpType
          };
          newDevices.push(newDevice);
        }
      });

      // let newArray = [...selectedDevices, ...newDevices]
      // setSelectedDevices(newArray);

      if (newDevices.length > 1) {
        navigate("multiplayer", { state: { devices: newDevices } });
        setSelectedDevices(newDevices);
        //Set some content from background page
        chrome.storage.local.set({ devices: selectedDevices }, function () {
          console.log("Storage Succesful");
        });
      }
    } else if (devices.length == 1) {
      let device = devices[0];
      let maxChannel = device.MaxChannel as number;
      if (maxChannel > 1) {
        let newDevices: IDevice[] = [];
        for (let i = 0; i < maxChannel; i++) {
          let channel = i + 1;
          const newDevice: IDevice = {
            id: "ump-player-" + channel,
            hostname: device.IPAddress,
            port: device.Port,
            username: device.Username,
            profile: "H.264",
            channel: channel,
            device: "camera",
            password: device.Password,
            autoplay: true,
            statistics: false,
            https: device.HttpType
          };
          newDevices.push(newDevice);
        }

        if (newDevices.length > 1) {
          navigate("multiplayer", { state: { devices: newDevices } });
          setSelectedDevices(newDevices);
          //Set some content from background page
          chrome.storage.local.set({ devices: newDevices }, function () {
            console.log("Storage Succesful");
          });
        }
      }
    } else {
      navigate("app.html");
      // navigate("multiplayer", { state: { devices: null } });
    }
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div style={{ display: 'flex', height: '100%', direction: rtl ? 'rtl' : 'ltr', width: '100vw' }}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, hasImage ? 0.9 : 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} />
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Player"
                icon={<BarChart />}
              // suffix={
              //   <Badge variant="danger" shape="circle">
              //     6
              //   </Badge>
              // }
              >
                <MenuItem component={<Link to="app.html" className="link" />}> Main Page</MenuItem>
                <MenuItem component={<Link to="singleplayer" className="link" />}> Single Player</MenuItem>
                <MenuItem component={<Link to="multiplayer" className="link" />}> Multi Player</MenuItem>
              </SubMenu>
              {/* <SubMenu
                label="Charts"
                icon={<BarChart />}
                suffix={
                  <Badge variant="danger" shape="circle">
                    6
                  </Badge>
                }
              >
                <MenuItem> Pie charts</MenuItem>
                <MenuItem> Line charts</MenuItem>
                <MenuItem> Bar charts</MenuItem>
              </SubMenu>
              <SubMenu label="Maps" icon={<Global />}>
                <MenuItem> Google maps</MenuItem>
                <MenuItem> Open street maps</MenuItem>
              </SubMenu>
              <SubMenu label="Theme" icon={<InkBottle />}>
                <MenuItem> Dark</MenuItem>
                <MenuItem> Light</MenuItem>
              </SubMenu>
              <SubMenu label="Components" icon={<Diamond />}>
                <MenuItem> Grid</MenuItem>
                <MenuItem> Layout</MenuItem>
                <SubMenu label="Forms">
                  <MenuItem> Input</MenuItem>
                  <MenuItem> Select</MenuItem>
                  <SubMenu label="More">
                    <MenuItem> CheckBox</MenuItem>
                    <MenuItem> Radio</MenuItem>
                  </SubMenu>
                </SubMenu>
              </SubMenu>
              <SubMenu label="E-commerce" icon={<ShoppingCart />}>
                <MenuItem> Product</MenuItem>
                <MenuItem> Orders</MenuItem>
                <MenuItem> Credit card</MenuItem>
              </SubMenu> */}
            </Menu>

            {/* <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<Calendar />} suffix={<Badge variant="success">New</Badge>}>
                Calendar
              </MenuItem>
              <MenuItem icon={<Book />}>Documentation</MenuItem>
              <MenuItem disabled icon={<Service />}>
                Examples
              </MenuItem>
            </Menu> */}
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>

      <main>
        {/* <div className="content" > */}
        <header>
          <div style={{ marginBottom: '16px' }}>
            {broken && (
              <button className="sb-button" onClick={() => setToggled(!toggled)}>
                Toggle
              </button>
            )}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="h4" fontWeight={600}>
              React Wisenet Player
            </Typography>
            <Typography variant="body2">
              React Wisenet Player provides a play of components based React for Hanwha Security Device player on Web browser environment.
            </Typography>
            <PackageBadges />
          </div>
          <div className="switchs">
            <Box sx={{ '& button': { m: 1 } }}>
              <Stack direction="row" spacing={1}>
                <Switch id="collapse" checked={collapsed} onChange={() => setCollapsed(!collapsed)} label="Collapse" />
                <Switch id="rtl" checked={rtl} onChange={handleRTLChange} label="RTL" />
                <Switch id="theme" checked={theme === 'dark'} onChange={handleThemeChange} label="Dark theme" />
                <Switch id="image" checked={hasImage} onChange={handleImageChange} label="Image" />
                <Switch id="use_default_account" checked={useDefault} onChange={useDefaultAccount} label="Use Default Account" />
                <Switch id="visual_device_table" checked={deviceTable} onChange={handleDeviceTable} label="Devices Table" />
                <IconButton aria-label="Add">
                  <AddIcon />
                </IconButton>
                <IconButton aria-label="Remove">
                  <RemoveIcon />
                </IconButton>
                <IconButton aria-label="Grid View">
                  <GridViewIcon />
                </IconButton>
                <Button color="primary" aria-label="Ratio 4:3">
                  4:3
                </Button>
                <Button color="primary" disabled aria-label="Ratio 16:9">
                  16:9
                </Button>
                <Button color="primary" aria-label="Ratio 1:1">
                  1:1
                </Button>
                <Button color="primary" aria-label="Ratio 1:2">
                  1:2
                </Button>
              </Stack>
            </Box>
          </div>
        </header>
        <content>
          <Routes>
            <Route path="/app.html" element={<div className='content'>Empty Page</div>} />
            <Route path="singleplayer" element={<SinglePlayerPage device={selectedDevice} />} />
            <Route path="multiplayer" element={<MultiPlayerPage devices={selectedDevices} />} />
          </Routes>
        </content>
        <footer>
          {deviceTable &&
            <DeviceTable devices={searchDevices}
              selectedDevicesFromParents={selectedDevices}
              handleSelectedDevice={onSelectedDevice}
              handleSelectedDevices={onSelectedDevices}
              handleUpdateDevice={fetchDevices} />
          }
        </footer>
        {/* <pre style={{ fontSize: 10 }}>
                    {JSON.stringify(selectedDevice, null, 4)}
                </pre> */}

        {/* </div> */}
      </main >
    </div >
  );
};