import { List, Image, Card, Typography, Empty } from 'antd'

const records = [
  {
    id: 'r1',
    date: '2025-10-28',
    floor: 'B1',
    system: '空調',
    content: '定期清潔與檢查',
    staff: '王小明',
    thumb: 'https://via.placeholder.com/120x80?text=Photo1'
  },
  {
    id: 'r2',
    date: '2025-10-25',
    floor: '2F',
    system: '消防',
    content: '檢查滅火器狀態',
    staff: '李小美',
    thumb: 'https://via.placeholder.com/120x80?text=Photo2'
  }
]

export default function Records() {
  return (
    <Card
      style={{
        background: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        保養記錄
      </Typography.Title>

      {records.length === 0 ? (
        <Empty
          description="尚無保養記錄"
          style={{ paddingTop: 40, paddingBottom: 40 }}
        />
      ) : (
        <List
          dataSource={records}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    width={100}
                    height={75}
                    src={item.thumb}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                }
                title={
                  <div>
                    <Typography.Text strong>
                      {item.date} | {item.floor} | {item.system}
                    </Typography.Text>
                  </div>
                }
                description={
                  <div style={{ marginTop: 4 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {item.content}
                    </Typography.Text>
                    <div style={{ marginTop: 4 }}>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        保養人員：{item.staff}
                      </Typography.Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
