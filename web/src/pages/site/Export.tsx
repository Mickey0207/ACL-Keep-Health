import React, { useState } from 'react';
import { Button, Card, List, Typography, message } from 'antd';
import { useParams } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAppStore } from '../../store/app';

const Export: React.FC = () => {
  const { id: siteId } = useParams();
  const records = useAppStore((s) => s.records.filter((r) => r.siteId === siteId));
  const [zipping, setZipping] = useState(false);

  const toSafeName = (s: string) => s.replace(/[\\/:*?"<>|\n\r]/g, '_');

  const onExport = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      // group by system
      const bySystem: Record<string, typeof records> = {} as any;
      for (const r of records) {
        bySystem[r.system] = bySystem[r.system] || [];
        bySystem[r.system].push(r);
      }
      for (const system of Object.keys(bySystem)) {
        const folder = zip.folder(toSafeName(system))!;
        let seq = 1;
        for (const r of bySystem[system]) {
          for (const p of r.photos) {
            const seqStr = String(seq).padStart(3, '0');
            const fileName = `${toSafeName(r.system)}_${toSafeName(r.content)}_${toSafeName(r.note || '')}_${toSafeName(r.staff)}_${seqStr}.jpg`;
            if (p.file) {
              const buf = await p.file.arrayBuffer();
              folder.file(fileName, buf);
            } else if (p.url) {
              const res = await fetch(p.url);
              const arr = await res.arrayBuffer();
              folder.file(fileName, arr);
            }
            seq++;
          }
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'export.zip');
      message.success('已完成打包下載');
    } catch (e) {
      console.error(e);
      message.error('打包失敗');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div style={{ padding: 12, paddingBottom: 80, maxWidth: 960, margin: '0 auto' }}>
      <Typography.Title level={4}>輸出照片</Typography.Title>
      <Card style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={onExport} loading={zipping} disabled={!records.length}>
          下載 Zip
        </Button>
      </Card>
      <List
        header={<div>將輸出 {records.reduce((acc, r) => acc + r.photos.length, 0)} 張照片</div>}
        dataSource={records}
        renderItem={(r) => (
          <List.Item>
            <List.Item.Meta title={`${r.date.slice(0,10)}｜${r.system}｜${r.floor}`} description={r.content} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Export;
