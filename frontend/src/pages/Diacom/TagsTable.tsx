import React, { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  InputAdornment,
  TextField,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Slider,
  Stack,
  Box,
} from "@mui/material";
import Search from "@mui/icons-material/Search";

const PREFIX = "TagsTable";
const classes = {
  searchField: `${PREFIX}-searchField`,
  slider: `${PREFIX}-slider`,
  container: `${PREFIX}-container`,
};

const Root = styled("div")(() => ({
  [`& .${classes.searchField}`]: {
    width: "45%",
  },
  [`& .${classes.slider}`]: {
    margin: 20,
  },
  [`&.${classes.container}`]: {
    padding: 10,
    overflow: "hidden",
  },
}));

// Interfaces
interface TagItem {
  Name: string;
  Type: string;
  Value: any;
}

interface TagsTableProps {
  data: Record<string, TagItem>;
}

interface DisplayItem {
  tag: string;
  name: string;
  type: string;
  value: string;
}

const TagsTable: React.FC<TagsTableProps> = ({ data }) => {
  const [searchfor, setSearchfor] = useState("");
  const [displayData, setDisplayData] = useState<DisplayItem[]>([]);
  const [instanceNumber, setInstanceNumber] = useState<number>(0);

  // Extract instance numbers if present
  const { instanceNumbers, sliderMin, sliderMax } = useMemo(() => {
    const instanceTag = data["0020,0013"]; // InstanceNumber
    if (instanceTag?.Value) {
      const values = Array.isArray(instanceTag.Value)
        ? instanceTag.Value
        : [instanceTag.Value];
      const numbers = values.map(Number).sort((a, b) => a - b);
      return {
        instanceNumbers: numbers,
        sliderMin: 0,
        sliderMax: numbers.length - 1,
      };
    }
    return { instanceNumbers: [0], sliderMin: 0, sliderMax: 0 };
  }, [data]);

  // Convert data into array for rendering
  const getMetaArray = useMemo(() => {
    const keys = Object.keys(data);
    return (currentInstance: number): DisplayItem[] =>
      keys.map((key) => {
        const element = data[key];
        let value = element?.Value ?? "";
        if (Array.isArray(value)) {
          // Pick by instance number if applicable
          value =
            value[currentInstance] !== undefined
              ? value[currentInstance]
              : value.join(", ");
        }
        if (key === "0020,0013") {
          value = currentInstance;
        }
        return {
          tag: key,
          name: element?.Name || key,
          type: element?.Type || "",
          value: value?.toString() ?? "",
        };
      });
  }, [data]);

  // Initial instance
  useEffect(() => {
    if (instanceNumbers.length > 0) {
      setInstanceNumber(instanceNumbers[0]);
    }
  }, [instanceNumbers]);

  // Update display data when search/instance changes
  useEffect(() => {
    const metaArray = getMetaArray(instanceNumber);
    if (!searchfor) {
      setDisplayData(metaArray);
      return;
    }
    const searchLo = searchfor.toLowerCase();
    const filtered = metaArray.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLo) ||
        item.value.toLowerCase().includes(searchLo) ||
        item.tag.toLowerCase().includes(searchLo)
    );
    setDisplayData(filtered);
  }, [searchfor, instanceNumber, getMetaArray]);

  const handleSliderChange = (_event: Event, value: number | number[]) => {
    const sliderValue = Array.isArray(value) ? value[0] : value;
    if (instanceNumbers[sliderValue] !== undefined) {
      setInstanceNumber(instanceNumbers[sliderValue]);
    }
  };

  return (
    <Root className={classes.container}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          id="search"
          type="search"
          label="Search Tags"
          value={searchfor}
          className={classes.searchField}
          onChange={(e) => setSearchfor(e.target.value)}
          margin="normal"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {instanceNumbers.length > 1 && (
          <Box width={300} display="flex" alignItems="center">
            <Slider
              title="Instance number"
              className={classes.slider}
              value={instanceNumbers.indexOf(instanceNumber)}
              min={sliderMin}
              max={sliderMax}
              marks
              onChange={handleSliderChange}
            />
            <div title="Instance number">{instanceNumber}</div>
          </Box>
        )}
      </Stack>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tag</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((item, index) => (
                <TableRow hover key={`${item.tag}-${index}`}>
                  <TableCell>{item.tag}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Root>
  );
};

export default TagsTable;
