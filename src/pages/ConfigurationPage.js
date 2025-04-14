import React from 'react'
import { SearchableTable, SimpleTableSection } from '../components/TableComponentConfig'
import { Box } from '@mui/material'


const ConfigurationPage = () => {
  return (
    <div>
        <Box mt={2} mb={2}>
        <SearchableTable />
        </Box>
    </div>
  )
}

export default ConfigurationPage