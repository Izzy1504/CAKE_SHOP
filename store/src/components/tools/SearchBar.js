// src/components/tools/SearchBar.js
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.scss';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.searchBarContainer}>
      <TextField
        placeholder="Tìm kiếm bánh"
        variant="outlined"
        value={searchQuery}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
        }}
        className={styles.searchField}
        size="small"
      />
    </div>
  );
};

export default SearchBar;