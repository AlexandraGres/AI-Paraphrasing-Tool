import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { SAMPLE_TEXT } from '@/constants';
import clsx from 'clsx';
import { paraphraseText } from '@/services/paraphraseText';
import styles from '@/styles/Paraphraser.module.scss';

function Paraphraser() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await paraphraseText(value);

    if (result.success) {
      setValue(result.data!);
      setSuccess(true);
    } else {
      setError(result.error!);
    }

    setLoading(false);
  };

  const handlePasteText = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setValue(clipText);
    } catch (error) {
      setError(`Clipboard read failed: ${error}`);
    }
  };

  const handleAddSampleText = () => {
    setValue(SAMPLE_TEXT);
  };

  const handleClearInput = () => {
    setValue('');
  };

  return (
    <Box className={styles.paraphraser}>
      <form onSubmit={handleSubmit}>
        <FormControl error={!!error} fullWidth sx={{ pb: '68px' }}>
          <TextField
            disabled={loading}
            className={styles.input}
            autoFocus
            placeholder='Enter text here or upload file to humanize it.'
            fullWidth
            rows={13}
            multiline
            variant='filled'
            value={value}
            onChange={handleOnchange}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: value ? '#fff' : '#EEF0F5',

                '&:before': {
                  borderBottomColor: value ? '#dbdcdf' : 'transparent',
                },
              },
            }}
          />
          {!value && (
            <Box
              display='flex'
              sx={{
                position: 'absolute',
                top: '142px',
                left: '50%',
                transform: 'translate(-50%)',
              }}
            >
              <Button
                sx={{ mr: 1 }}
                className={styles.insertButton}
                variant='outlined'
                startIcon={<ContentPasteOutlinedIcon />}
                onClick={handlePasteText}
              >
                Paste text
              </Button>
              <Button
                className={styles.insertButton}
                variant='outlined'
                startIcon={<InsertDriveFileOutlinedIcon />}
                onClick={handleAddSampleText}
              >
                Sample text
              </Button>
            </Box>
          )}
          <Box className={styles.formFooter}>
            {!success && (
              <>
                {value && !loading && (
                  <Button
                    className={clsx(styles.bottomButtons, styles.gray)}
                    startIcon={<CloseOutlinedIcon />}
                    variant='contained'
                    sx={{ mr: 1 }}
                    onClick={handleClearInput}
                  >
                    Clear input
                  </Button>
                )}
                <Button
                  type='submit'
                  className={clsx(styles.bottomButtons, styles.blue)}
                  variant='contained'
                  disabled={!value || loading}
                >
                  {loading ? 'Paraphrasing' : 'Paraphrase'}
                </Button>
              </>
            )}
          </Box>
          {error && (
            <FormHelperText
              sx={{
                fontSize: '12px',
                mt: 1,
              }}
            >
              {error}
            </FormHelperText>
          )}
        </FormControl>
      </form>
    </Box>
  );
}

export default Paraphraser;
