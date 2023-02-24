import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import plus from "../assets/icons/plus.svg";
import { AG_GRID_LOCALE_EN } from "../locale/locale";
import OpcionTabledCrud from "./OpcionTabledCrud";
import UserRegister from "./UserRegister";
export const DataTableUsers = () => {
  const [gridApi, setGridApi] = useState(null);

  const gridRef = useRef();
  
  const getData =  useCallback(async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    return await response.data;
  },[]);
  const setPrinterFriendly = (api) => {
    const eGridDiv = document.querySelector("#myGrid");
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    api.setDomLayout("print");
  };
  const setNormal = (api) => {
    const eGridDiv = document.querySelector("#myGrid");
    eGridDiv.style.width = "700px";
    eGridDiv.style.height = "600px";
    api.setDomLayout();
  };
  const [stateModel, StateModel] = useState(false);
  useEffect(() => {
    getData().then((data) => {
      setGridApi(data);
    });
  }, []);
  var checkboxSelection = function (params) {
    // we put checkbox on the name if we are not doing grouping
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  var headerCheckboxSelection = function (params) {
    // we put checkbox on the name if we are not doing grouping
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Nombre",
      field: "name",
      rowDrag: true,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
      chartDataType: 'name'
    },
    {
      headerName: "Correo",
      field: "email",
      chartDataType: 'email'
    },
    {
      headerName: "Identificador",
      field: "id",
      filter: "agNumberColumnFilter",
      chartDataType: 'id'
    },
    {
      headerName: "Descripcion",
      field: "body",
    },
    {
      headerName: "Unico",
      field: "postId",
      chartDataType: 'postId'
    },
    {
      headerName: "Opciones",
      field: "Settings",
      cellRenderer: OpcionTabledCrud,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      minWidth: 100,
      localeText: AG_GRID_LOCALE_EN,
      editable: true,
      tooltipComponent: "customTooltip",
    };
  }, []);

  const handleShowModel = () => {
    StateModel(!stateModel);
  };
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtExportExel = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);
  const onBtPrint = useCallback(() => {
    const api = gridRef.current.api;
    setPrinterFriendly(api);
    setTimeout(function () {
      window.print();
      setNormal(api);
    }, 2000);
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const onChart1 = useCallback(() => {
    var params = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 3,
        columns: [ 'id','postId','name', 'email', 'body'],
      },
      chartType: 'groupedColumn',
      chartThemeName: 'ag-vivid',
      chartThemeOverrides: {
        common: {
          title: {
            enabled: true,
            text: 'Estadisticas de usuarios',
          },
        },
      },
    };
    gridRef.current.api.createRangeChart(params);
  }, []);

  const onChart2 = useCallback(() => {
    var params = {
      cellRange: {
        columns: [ 'id','postId','name', 'email', 'body'],
      },
      chartType: 'groupedBar',
      chartThemeName: 'ag-pastel',
      chartThemeOverrides: {
        common: {
          title: {
            enabled: true,
            text: 'Todos los usuarios',
          },
          legend: {
            enabled: false,
          },
        },
      },
      unlinkChart: true,
    };
    gridRef.current.api.createRangeChart(params);
  }, []);
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <>
      <UserRegister estado={stateModel} />
      <div className="panel_opciones bg-white w-[90%] mx-auto mt-10 mb-2 rounded-md p-4">
        <div className="plus_panel flex justify-between items-center">
        <section className="items-center">
            Herramientas
          </section>
          <section>hellow</section>
          <section className="flex ">
          <button onClick={onBtnExport} className="flex items-center border mx-1 p-1 rounded-md">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="green"
                  d="M5 21q-.825 0-1.413-.588T3 19V6.5q0-.375.125-.675t.325-.575l1.4-1.7q.2-.275.5-.413T6 3h12q.35 0 .65.137t.5.413l1.4 1.7q.2.275.325.575T21 6.5V19q0 .825-.588 1.413T19 21H5Zm.4-15h13.2l-.85-1H6.25L5.4 6ZM5 8v11h14V8H5Zm7 10l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14l4 4Zm-7 1h14H5Z"
                />
              </svg>
            </span>
            <span>Descargar archivo scv</span>
          </button>
          <button onClick={onBtExportExel} style={{ fontWeight: "bold" }} className="flex items-center border mx-1 p-1 rounded-md">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#158c51"
                  d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.495v20.846a.5.5 0 0 1-.57.495L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99zM17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4V3zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13l-2.8-4z"
                />
              </svg>
            </span>
            <span>Exportar a excel</span>
          </button>
          <button className="flex items-center border mx-1 p-1 rounded-md">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0c6e36"
                  d="M4 3h14a2 2 0 0 1 2 2v7.08a6.01 6.01 0 0 0-4.32.92H12v4h1.08c-.11.68-.11 1.35 0 2H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2m0 4v4h6V7H4m8 0v4h6V7h-6m-8 6v4h6v-4H4m14.44 2v2h4v2h-4v2l-3-3l3-3"
                />
              </svg>
            </span>
            <span>Importar archivo excel </span>
          </button>
          <button onClick={onBtPrint} className="flex items-center border mx-1 p-1 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18 7H6V3h12v4Zm0 5.5q.425 0 .713-.288T19 11.5q0-.425-.288-.713T18 10.5q-.425 0-.713.288T17 11.5q0 .425.288.713T18 12.5ZM16 19v-4H8v4h8Zm2 2H6v-4H2v-6q0-1.275.875-2.138T5 8h14q1.275 0 2.138.863T22 11v6h-4v4Z"
              />
            </svg>
            <span>Imprimir</span>
          </button>
          <button onClick={handleShowModel} className=" bg-[#1daf53] text-white flex items-center p-1 rounded-md border">
            <img src={plus} alt="" />
            Crear usuario
          </button>
          </section>
          
        </div>
        <div className="panel2">
         <div className="buttons">
         
         </div>
        </div>
      </div>
      <div className="buttons">
        <div className="anality_ panel w-[90%] mx-auto flex items-center justify-between">
          <div className="cell_panel flex">
          <button onClick={onChart2} className="bg-white hover:shadow-lg inline-block mx-1 mb-4 rounded-xl p-2">
           <div className="flex items-center">
           <span className="mx-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 16 16">
              <path fill="#3498DB" fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/></svg>
            </span>
            <span className="py-2 block">Estadisticas de todos los usuarios</span>
           </div>
            </button>
          <button onClick={onChart1} className="bg-white hover:shadow-lg inline-block mx-1 mb-4 rounded-xl p-2">
           <div className="flex items-center">
           <span className="mx-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 16 16">
              <path fill="#3498DB" fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/></svg>
            </span>
            <span className="py-2 block">Estadisticas de los 5 primeros usuarios</span>
           </div>
            </button>
            
          </div>
          <div className="cell_panel">
            
          </div>
          <div className="cell_panel">
            <div className="search_panel flex border rounded-full items-center overflow-hidden bg-white shadow-sm">
              <div className="search_icon p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <g transform="translate(24 0) scale(-1 1)"><path fill="#BFC9CA" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/></g></svg>
              </div>
              <div className="inout">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Buscar..."
            onInput={onFilterTextBoxChanged}
            className="p-2 w-full outline-none"
          />

              </div>
            </div>
          </div>
         

        </div>
      </div>
      <div
        className="ag-theme-alpine shadow-2xl mx-auto "
        id="myGrid"
        style={{ height: 600, width: "90%",  }}
      >
        <AgGridReact
          ref={gridRef}
          localeText={AG_GRID_LOCALE_EN}
          columnDefs={columnDefs}
          rowData={gridApi}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowGroupPanelShow="always"
          pivotPanelShow="always"
          rowDragManaged={true}
          enableRangeSelection={true}
          sideBar={true}
          icons={true}
          pagination={true}
          paginationPageSize={20}
          paginateChildRows={true}
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          rowSelection={"multiple"}
          enableCharts={true}
          popupParent={popupParent}
          cacheQuickFilter={true}
          enableCellTextSelection={true}
          maxConcurrentDatasourceRequests={1}
          suppressAggFuncInHeader={true}
          purgeClosedRowNodes={true}
          cacheBlockSize={20}
          tooltipShowDelay={0}
          tooltipHideDelay={2000}
          
        ></AgGridReact>
      </div>
    </>
  );
};