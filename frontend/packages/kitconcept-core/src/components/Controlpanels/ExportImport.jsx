/**
 * ContentTransfer control panel
 * using @plone/components (React Aria based)
 */

import React, { useState } from 'react';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Link } from 'react-router-dom';
import { useClient } from '@plone/volto/hooks/client/useClient';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import { Button, Container } from '@plone/components';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

import { useDispatch } from 'react-redux';
import {
  exportContent,
  importContent,
} from '../../actions/exportImport/exportImport';

import uploadSVG from '@plone/volto/icons/upload.svg';
import downloadSVG from '@plone/volto/icons/download.svg';
import backSVG from '@plone/volto/icons/back.svg';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  exportSuccess: {
    id: 'Export successful',
    defaultMessage: 'Export successful',
  },
  exportContent: {
    id: 'Export Content',
    defaultMessage: 'Export Content',
  },
  exportSite: {
    id: 'Export Site',
    defaultMessage: 'Export Site',
  },
  importContent: {
    id: 'Import Content',
    defaultMessage: 'Import Content',
  },
  importSite: {
    id: 'Import Site',
    defaultMessage: 'Import Site',
  },
  fileFirst: {
    id: 'Select a file first',
    defaultMessage: 'Select a file first',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  importSuccess: {
    id: 'Import successful',
    defaultMessage: 'Import successful',
  },
  exporting: {
    id: 'Exporting…',
    defaultMessage: 'Exporting…',
  },
  importing: {
    id: 'Importing…',
    defaultMessage: 'Importing…',
  },
});

const ContentTransfer = ({ pathname }) => {
  const [file, setFile] = useState(null);
  const intl = useIntl();
  const isClient = useClient();
  const dispatch = useDispatch();

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      const res = await dispatch(exportContent());

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.zip';
      a.click();

      window.URL.revokeObjectURL(url);

      toast.success(
        <Toast
          success
          title={intl.formatMessage(messages.success)}
          content={intl.formatMessage(messages.exportSuccess)}
        />,
      );
    } catch (e) {
      toast.error(
        <Toast
          error
          title={intl.formatMessage(messages.error)}
          content={e.message}
        />,
      );
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error(
        <Toast
          error
          title={intl.formatMessage(messages.error)}
          content={intl.formatMessage(messages.fileFirst)}
        />,
      );
      return;
    }
    try {
      setImporting(true);
      await dispatch(importContent(file));
      toast.success(
        <Toast
          success
          title={intl.formatMessage(messages.success)}
          content={intl.formatMessage(messages.importSuccess)}
        />,
      );
    } catch (e) {
      toast.error(
        <Toast
          error
          title={intl.formatMessage(messages.error)}
          content={e.message}
        />,
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <div id="page-controlpanel-content-transfer">
      <Container width="layout">
        <div className="grid-container">
          <div className="grid-column export">
            <h2>{intl.formatMessage(messages.exportContent)}</h2>

            <Button
              variant="primary"
              isDisabled={exporting}
              onPress={handleExport}
            >
              <Icon name={downloadSVG} size="20px" />
              {exporting ? (
                <span>{intl.formatMessage(messages.exporting)}</span>
              ) : (
                <span>{intl.formatMessage(messages.exportSite)}</span>
              )}
            </Button>
          </div>

          <div className="grid-column import">
            <h2>{intl.formatMessage(messages.importContent)}</h2>

            <input
              type="file"
              accept=".zip"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Button
              variant="primary"
              isDisabled={!file || importing}
              onPress={handleImport}
            >
              <Icon name={uploadSVG} size="20px" />
              {importing ? (
                <span>{intl.formatMessage(messages.importing)}</span>
              ) : (
                <span>{intl.formatMessage(messages.importSite)}</span>
              )}
            </Button>
          </div>
        </div>
      </Container>

      {isClient &&
        createPortal(
          <Toolbar
            pathname={pathname}
            hideDefaultViewButtons
            inner={
              <>
                <Link to="/controlpanel" className="item">
                  <Icon
                    name={backSVG}
                    aria-label={intl.formatMessage(messages.back)}
                    className="contents circled"
                    size="30px"
                    title={intl.formatMessage(messages.back)}
                  />
                </Link>
              </>
            }
          />,
          document.getElementById('toolbar'),
        )}
    </div>
  );
};

export default ContentTransfer;
