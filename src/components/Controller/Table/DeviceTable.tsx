import React, { useEffect, useState } from 'react';
import { Checkbox } from "@mui/material";
import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowModel,
  GridFooter,
  useGridApiContext,
  useGridApiEventHandler,
  GridEventListener,
  GridRowParams,
  MuiEvent,
  GridCallbackDetails,
  GridRowSelectionModel,
  GridRowId
} from '@mui/x-data-grid';
import {
  Alert,
  AlertProps,
  Chip,
  Stack
} from '@mui/material';
import TextField from '@mui/material/TextField';
import {
  IDevice,
  deviceTypeOptions,
  deviceHttpOptions,
  ISearchDevice,
  SearchDevicesProps,
  ResetClientProps,
  IInitializedData,
  deviceChannelOptions,
  DeviceTableProps
} from '../../ump-player/Constant/Constant';
import { SunapiManager } from '../../ump-player/sunapi/SunapiManager';

// const fastJsonStringfy = window.fastJsonStringfy;

interface PropsWithHandler extends DeviceTableProps {
  handleSelectedDevice: (device: ISearchDevice) => void;
  handleSelectedDevices: (devices: ISearchDevice[]) => void;
  handleUpdateDevice: (device: ISearchDevice, from: Number) => void;
};

export const Footer: React.FC<SearchDevicesProps> = ({ devices }) => {
  const [message, setMessage] = React.useState('');
  const apiRef = useGridApiContext();

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setMessage(`Device "${params.row.IPAddress}" clicked.`);
  };

  const handleCheckboxChange: GridEventListener<'rowSelectionCheckboxChange'> = (params) => {
    setMessage(`Device "${params.id}" selected.`);
    // const selectedIDs = new Set([params.id]);
    // const selectedRows = devices.filter((row: any) =>
    //     selectedIDs.has(row.id),
    // );
    // setMessage(`Device "${selectedRows[0].IPAddress}" selected.`);
  };

  useGridApiEventHandler(apiRef, 'rowClick', handleRowClick);
  useGridApiEventHandler(apiRef, 'rowSelectionCheckboxChange', handleCheckboxChange);

  return (
    <React.Fragment>
      <GridFooter />
      {message && <Alert severity="info">{message}</Alert>}
    </React.Fragment>
  );
}

const updateRowData = () => {
  return React.useCallback(
    (device: Partial<ISearchDevice>) =>
      new Promise<Partial<ISearchDevice>>((resolve, reject) => {
        // setTimeout(() => {
        if (device.Username !== "") {
          resolve({ ...device, Username: device.Username });
        }

        if (device.Password !== "") {
          resolve({ ...device, Password: device.Password });
        }

        if (device.HttpType === true) {
          if (device.HttpsPort !== 0) {
            resolve({ ...device, Port: device.HttpsPort });
          }
          else {
            reject(new Error("Error while update port: this port can't use 0."));
          }
        } else {
          if (device.HttpPort !== 0) {
            resolve({ ...device, Port: device.HttpPort });
          } else {
            reject(new Error("Error while update port: this port can't use 0."));
          }
        }

        if (device.Channel !== 0) {
          resolve({ ...device, Channel: device.Channel });
        }
        // }, 100);
      }),
    [],
  );
};

export const DeviceTable: React.FC<PropsWithHandler> = ({ devices, selectedDevicesFromParents, handleSelectedDevice, handleSelectedDevices, handleUpdateDevice }) => {
  // set data to selectRows which selected items on data grid
  // https://codesandbox.io/p/sandbox/64104554-can-i-initialize-the-checkbox-selection-in-a-material-ui-datagrid-6pjrg?file=%2Fdemo.tsx%3A46%2C9-46%2C40
  // const [rowSelectionModel, setSelectionModel] = useState<GridRowSelectionModel>(() =>
  //   devices.filter(
  //     device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  //   ).map(device => device.id)
  // );
  // console.log(devices.filter(
  //   device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  // ).map(device => device.id));
  // const a = devices.filter(
  //   device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  // ).map(device => device.id) as GridRowSelectionModel;
  // devices.filter(
  //   device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  // ).map(device => device.id) as GridRowSelectionModel

  // const [rowSelectionModel, setSelectionModel] = useState<GridRowSelectionModel>(() => {
  //   return devices.filter(
  //     device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  //   ).map(device => device.id as GridRowId);
  // });
  const [selectedDevices, setSelectedRows] = React.useState<ISearchDevice[]>(() => {
    return devices.filter(
      device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
    );
  });
  const [selectedDevice, setSelectedRow] = React.useState<ISearchDevice>({
    id: "",
    Model: "",
    Type: 0,
    Username: "",
    Password: "",
    IPAddress: "",
    MACAddress: "",
    Port: 0,
    Channel: 1,
    MaxChannel: 1,
    HttpType: false,
    HttpPort: 80,
    HttpsPort: 443,
    Gateway: "",
    SubnetMask: "",
    SupportSunapi: true,
    URL: ""
  });
  const columns: GridColDef[] = [
    {
      field: "Model",
      headerName: "Model",
      cellClassName: "name-column--cell",
      width: 150,
    },
    {
      field: "Type",
      headerName: "Type",
      type: 'singleSelect',
      valueOptions: deviceTypeOptions,
    },
    {
      field: "Username",
      headerName: "Username",
      editable: true,
      align: 'left',
      // width: 200
    },
    {
      field: "Password",
      headerName: "Password",
      editable: true,
      align: 'left',
      // render: rowData => <p>{rowData.password.split('').map(() => '*')}</p>,
      // editComponent: props => (
      //     <TextField
      //         type="password"
      //         value={props.value}
      //         onChange={e => props.onChange(e.target.value)}
      //     />),
      // width: 200
    },
    {
      field: "Channel",
      headerName: "CH",
      editable: true,
      type: 'singleSelect',
      // valueOptions: deviceChannelOptions,
      valueOptions: ({ id, row, field }) => {
        if (field === "Channel" && row.MaxChannel > 1) {
          //return valueOptions for the row here
          // console.log(id, row, field);
          return deviceChannelOptions.filter((item) => item.value <= row.MaxChannel);
        } else {
          return deviceChannelOptions.filter((item) => item.value <= 1);
        }
      },
      // valueFormatter: ({ id, value, field }) => {
      //   const option = deviceHttpOptions.find(
      //     ({ value: optionValue }) => optionValue === value
      //   );

      //   const selectedIDs = new Set([id]);
      //   const selectedRows = devices.filter((row: any) =>
      //     selectedIDs.has(row.id),
      //   );
      // },
      // row === undefined
      //   ? ["active", "deleted", "inactive"]
      //   : ["active", "inactive"],
      width: 40
    },
    {
      field: "IPAddress",
      headerName: "IP Address",
      width: 150
    },
    {
      field: "MACAddress",
      headerName: "MAC Address",
    },
    {
      field: "Port",
      headerName: "Port",
      width: 40
    },
    {
      field: "HttpPort",
      headerName: "Http Port",
      width: 40
    },
    {
      field: "HttpsPort",
      headerName: "Https Port",
      width: 40
    },
    {
      field: "HttpType",
      headerName: "Secure",
      // flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: deviceHttpOptions,
      valueFormatter: ({ id, value, field }) => {
        const option = deviceHttpOptions.find(
          ({ value: optionValue }) => optionValue === value
        );

        const selectedIDs = new Set([id]);
        const selectedRows = devices.filter((row: any) =>
          selectedIDs.has(row.id),
        );
        if (field === "HttpType") {
          selectedRows[0].HttpType = value;
          if (value) {
            selectedRows[0].Port = selectedRows[0].HttpsPort;
          } else {
            selectedRows[0].Port = selectedRows[0].HttpPort;
          }
          //   handleUpdateDevice(selectedRows[0], 1);
        }

        return option!.label;
      },
    },
    {
      field: "Gateway",
      headerName: "Gateway",
    },
    {
      field: "SubnetMask",
      headerName: "Subnet Mask",
    },
    {
      field: "SupportSunapi",
      headerName: "Support SUNAPI",
    },
    {
      field: "URL",
      headerName: "URL",
      width: 300
    }
  ];

  // useEffect(() => {
  //   const rowSelectionData = devices.filter(
  //     device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  //   ).map(device => device.id);
  //   // console.log("data:" + devices.filter(
  //   //   device => selectedDevicesFromParents.some(selected => selected.hostname === device.IPAddress)
  //   // ).map(device => device.id))
  //   rowSelectionData.forEach(element => {
  //     console.log("data:" + element);
  //     setSelectionModel(element);
  //   });

  //   console.log(rowSelectionModel);
  // });

  const updateRow = updateRowData();
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend
      const response = await updateRow(newRow);
      const updateData = response as ISearchDevice;
      setSnackbar({ children: 'User successfully saved', severity: 'success' });

      // change device port with http type
      if (updateData.HttpType) {
        updateData.Port = updateData.HttpsPort;
      } else {
        updateData.Port = updateData.HttpPort;
      }

      if (selectedDevice.IPAddress !== updateData.IPAddress ||
        selectedDevice.Channel !== updateData.Channel ||
        selectedDevice.Username !== updateData.Username ||
        selectedDevice.Password !== updateData.Password ||
        selectedDevice.Port !== updateData.Port ||
        selectedDevice.HttpType !== updateData.HttpType) {
        setSelectedRow(updateData);
        handleSelectedDevice(updateData);
      }

      handleUpdateDevice(updateData, 1);
      return updateData;
    },
    [updateRow],
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const onRowsSelectionHandler = (ids: any) => {
    // setSelectionModel(ids);
    const selectedIDs = new Set(ids);
    const selectedRows = devices.filter((row: any) =>
      selectedIDs.has(row.id),
    );
    setSelectedRows(selectedRows);
    console.log(selectedDevices);
    handleSelectedDevices(selectedRows);
  };

  const handleRowClick = (
    params: GridRowParams, // GridRowParams
    event: MuiEvent<React.MouseEvent<HTMLElement>>, // MuiEvent<React.MouseEvent<HTMLElement>>
    details: GridCallbackDetails, // GridCallbackDetails
  ) => {
    // console.log(fastJsonStringfy(params.row));
    setSelectedRow(params.row);
    handleSelectedDevice(params.row);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={devices}
        columns={columns}
        // rowHeight={30}
        // getRowId={(row: any) => row.MACAddress + '_' + row.IPAddress}
        getRowId={(row: any) => row.id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
          columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
              HttpPort: false,
              HttpsPort: false,
              MACAddress: false,
              Gateway: false,
              SubnetMask: false,
              SupportSunapi: false,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
        // pageSizeOptions={[40]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        disableRowSelectionOnClick
        onRowClick={handleRowClick} // here
        slots={{
          toolbar: GridToolbar,
          loadingOverlay: LinearProgress,
          footer: Footer
        }}
      />
      {/* <pre style={{ fontSize: 10 }}>
                {JSON.stringify(selectedDevices, null, 4)}
            </pre> */}
    </Box>
  );
}
