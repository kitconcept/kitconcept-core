/**
 * ContentTransfer control panel
 * using @plone/components (React Aria based)
 */

import React, { useRef, useState } from 'react';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Link } from 'react-router-dom';
import { useClient } from '@plone/volto/hooks/client/useClient';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import { Button, Container } from '@plone/components';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';
import { importContent } from '../../actions/exportImport/exportImport';

import importSVG from '../../icons/import.svg';
import exportSVG from '../../icons/export.svg';
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
  chooseFile: {
    id: 'Choose file',
    defaultMessage: 'Choose file',
  },
  noFileSelected: {
    id: 'No file selected',
    defaultMessage: 'No file selected',
  },
});

const ContentTransfer = ({ pathname }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const intl = useIntl();
  const isClient = useClient();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userSession.token);
  const siteTitle =
    useSelector((state) => state.site?.data?.['plone.site_title']) || 'site';

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      const res = await fetch('/++api++/@export', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 16).replace(':', '-');
      const safeSiteTitle = siteTitle
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9-_]/g, '-');
      a.download = `${timestamp}_${safeSiteTitle}.zip`;
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
            <span>
              <Icon name={exportSVG} size="50px" />
            </span>

            <Button
              variant="primary"
              isDisabled={exporting}
              onPress={handleExport}
            >
              {exporting ? (
                <span>{intl.formatMessage(messages.exporting)}</span>
              ) : (
                <span>{intl.formatMessage(messages.exportSite)}</span>
              )}
            </Button>
          </div>

          <div className="grid-column import">
            <h2>{intl.formatMessage(messages.importContent)}</h2>
            <span>
              <Icon name={importSVG} size="50px" />
            </span>

            <div className="file-input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
                hidden
              />
              <Button
                variant="secondary"
                onPress={() => fileInputRef.current?.click()}
              >
                {intl.formatMessage(messages.chooseFile)}
              </Button>
              <span className="file-input-name">
                {file
                  ? file.name.length > 48
                    ? `${file.name.slice(0, 35)}…${file.name.slice(-12)}`
                    : file.name
                  : intl.formatMessage(messages.noFileSelected)}
              </span>
            </div>

            <Button
              variant="primary"
              isDisabled={!file || importing}
              onPress={handleImport}
            >
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
