import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import Translation from "../../translations/FilterOnRegDate.json";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { fr, enIN } from "date-fns/locale";

function DateRangeSelector({ onSetDate }) {
  const { t } = useTranslation();
  const locales = { enIN, fr };

  var selectedLanguage = localStorage.getItem("SelectedLanguage") || "en";
  var defaultText = "Select DateRange To check Bed Status";
  var languageText = {
    en: "Select DateRange To check Bed Status",
    fr: "Sélectionnez DateRange pour vérifier l'état du lit",
  };
  var ButtonTextSet = {
    en: "Set Date",
    fr: "Régler la date",
  };
  var ButtonTextClear = {
    en: "Clear Date",
    fr: "Effacer la date",
  };
  var displayText = languageText[selectedLanguage] || defaultText;

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
      <DateRangePicker
        locale={locales[selectedLanguage]}
        ranges={selectedDateRange}
        onChange={handleSelect}
        inputRanges={[]}
      />
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
        {ButtonTextClear[selectedLanguage]}
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
        {ButtonTextSet[selectedLanguage]}
      </Button>
    </Popover>
  );

  return (
    <div>
      <h2 style={{ fontSize: "12px", fontWeight: "bold" }}>{displayText}</h2>
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
          style={{ fontSize: "12px", marginTop: "12px" }}
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

export default DateRangeSelector;
