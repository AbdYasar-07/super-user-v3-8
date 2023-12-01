import { Button, Tooltip } from "@mui/material";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";


const ExportExcel = ({ excelData, fileName }) => {

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const extension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'ImportedUsers': ws }, SheetNames: ['ImportedUsers'] };
        const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + extension);
    }

    return (
        <>
            <Tooltip title="Excel Export">
                <Button variant="contained" onClick={(e) => exportToExcel(fileName)} color="primary" style={{ cursor: "pointer", fontSize: "14px" }}>
                    Excel Export
                </Button>
            </Tooltip>

        </>

    );

}

export default ExportExcel;