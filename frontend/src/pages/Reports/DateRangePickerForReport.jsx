import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

function DateRangePickerForReport({ onSetDate }) {
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setSelectedDateRange([ranges.selection]);
  };

  const handleClear = () => {
    setSelectedDateRange([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
  };

  const handleSetDate = () => {
    setPopoverOpen(false);

    if (onSetDate) {
      const startDate = selectedDateRange[0].startDate || "";
      const endDate = selectedDateRange[0].endDate || "";
      onSetDate(startDate, endDate);
    }
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  const formatDateString = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  const popover = (
    <Popover id="date-range-popover">
      <DateRangePicker ranges={selectedDateRange} onChange={handleSelect} />
      <Button
        style={{
          fontSize: "12px",
          marginBottom: "10px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
        variant="danger"
        onClick={handleClear}
      >
        Clear Date
      </Button>
      <Button
        style={{
          fontSize: "12px",
          marginBottom: "10px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
        variant="success"
        onClick={handleSetDate}
      >
        Set Date
      </Button>
    </Popover>
  );

  return (
    <div>
      {/* <h2 style={{ fontSize: "16px" }}>Select Date Range</h2> */}
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={popover}
        rootClose
        show={popoverOpen}
        onToggle={(show) => setPopoverOpen(show)}
      >
        <input
          type="text"
          style={{ fontSize: "14px", marginTop: "0px" }}
          className="form-control"
          placeholder="Select Date Range"
          value={`${formatDateString(
            selectedDateRange[0].startDate
          )} - ${formatDateString(selectedDateRange[0].endDate)}`}
          readOnly
        />
      </OverlayTrigger>
    </div>
  );
}

export default DateRangePickerForReport;
