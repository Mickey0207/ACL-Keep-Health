import { useState, useMemo } from 'react'
import { List, Image, Card, Typography, Empty, Input, Select, Button, Divider, Drawer } from 'antd'
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons'

const recordsData = [
  {
    id: 'r1',
    date: '2025-10-28',
    floor: 'B1',
    location: '大廳',
    system: '空調',
    content: '定期清潔與檢查',
    staff: '王小明',
    photos: 3,
    thumb: 'https://via.placeholder.com/120x80?text=Photo1'
  },
  {
    id: 'r2',
    date: '2025-10-25',
    floor: '2F',
    location: '辦公室',
    system: '消防',
    content: '檢查滅火器狀態',
    staff: '李小美',
    photos: 1,
    thumb: 'https://via.placeholder.com/120x80?text=Photo2'
  },
  {
    id: 'r3',
    date: '2025-10-20',
    floor: 'B1',
    location: '機房',
    system: '電力',
    content: '檢查配電盤運作狀況',
    staff: '王小明',
    photos: 2,
    thumb: 'https://via.placeholder.com/120x80?text=Photo3'
  },
  {
    id: 'r4',
    date: '2025-10-15',
    floor: '1F',
    location: '大廳',
    system: '空調',
    content: '更換空調濾網',
    staff: '李小美',
    photos: 4,
    thumb: 'https://via.placeholder.com/120x80?text=Photo4'
  }
]

export default function Records() {
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState<{
    floors: string[]
    locations: string[]
    systems: string[]
    dates: string[]
  }>({
    floors: [],
    locations: [],
    systems: [],
    dates: []
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 提取所有獨特的樓層、保養位置、維運系統、日期
  const uniqueFloors = Array.from(new Set(recordsData.map(r => r.floor))).sort()
  const uniqueLocations = Array.from(new Set(recordsData.map(r => r.location))).sort()
  const uniqueSystems = Array.from(new Set(recordsData.map(r => r.system))).sort()
  const uniqueDates = Array.from(new Set(recordsData.map(r => r.date))).sort().reverse()

  // 篩選和搜尋邏輯
  const filteredRecords = useMemo(() => {
    return recordsData.filter(item => {
      // 文字搜尋
      const matchesSearch = searchText === '' || 
        item.date.includes(searchText) ||
        item.floor.includes(searchText) ||
        item.location.includes(searchText) ||
        item.system.includes(searchText) ||
        item.content.includes(searchText) ||
        item.staff.includes(searchText)

      // 樓層篩選
      const matchesFloor = filters.floors.length === 0 || filters.floors.includes(item.floor)

      // 保養位置篩選
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(item.location)

      // 維運系統篩選
      const matchesSystem = filters.systems.length === 0 || filters.systems.includes(item.system)

      // 日期篩選
      const matchesDate = filters.dates.length === 0 || filters.dates.includes(item.date)

      return matchesSearch && matchesFloor && matchesLocation && matchesSystem && matchesDate
    })
  }, [searchText, filters])

  const handleFloorChange = (value: string[]) => {
    setFilters({ ...filters, floors: value })
  }

  const handleSystemChange = (value: string[]) => {
    setFilters({ ...filters, systems: value })
  }

  const handleDateChange = (value: string[]) => {
    setFilters({ ...filters, dates: value })
  }

  const handleLocationChange = (value: string[]) => {
    setFilters({ ...filters, locations: value })
  }

  const handleReset = () => {
    setSearchText('')
    setFilters({ floors: [], locations: [], systems: [], dates: [] })
  }

  // 檢查是否有應用篩選
  const hasFilters = filters.floors.length > 0 || filters.locations.length > 0 || filters.systems.length > 0 || filters.dates.length > 0

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

      {/* 搜尋框和篩選按鈕 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <Input
          placeholder="搜尋保養記錄（日期、樓層、系統、內容、人員）"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="large"
          style={{ borderRadius: 6, flex: 1 }}
        />
        <Button
          icon={<FilterOutlined />}
          size="large"
          onClick={() => setDrawerOpen(true)}
          style={{
            borderColor: hasFilters ? '#0ea5e9' : undefined,
            color: hasFilters ? '#0ea5e9' : undefined
          }}
        >
          篩選
        </Button>
      </div>

      {/* 篩選抽屜 */}
      <Drawer
        title="篩選條件"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={360}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 樓層篩選 */}
          <div>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              樓層
            </Typography.Text>
            <Select
              mode="multiple"
              placeholder="選擇樓層"
              value={filters.floors}
              onChange={handleFloorChange}
              options={uniqueFloors.map(floor => ({ label: floor, value: floor }))}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          {/* 保養位置篩選 */}
          <div>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              保養位置
            </Typography.Text>
            <Select
              mode="multiple"
              placeholder="選擇保養位置"
              value={filters.locations}
              onChange={handleLocationChange}
              options={uniqueLocations.map(location => ({ label: location, value: location }))}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          {/* 維運系統篩選 */}
          <div>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              維運系統
            </Typography.Text>
            <Select
              mode="multiple"
              placeholder="選擇維運系統"
              value={filters.systems}
              onChange={handleSystemChange}
              options={uniqueSystems.map(system => ({ label: system, value: system }))}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          {/* 保養日期篩選 */}
          <div>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              保養日期
            </Typography.Text>
            <Select
              mode="multiple"
              placeholder="選擇保養日期"
              value={filters.dates}
              onChange={handleDateChange}
              options={uniqueDates.map(date => ({ label: date, value: date }))}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          {/* 重置按鈕 */}
          <Divider style={{ margin: '16px 0' }} />
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleReset}
            style={{ width: '100%' }}
            size="large"
          >
            清除篩選
          </Button>
        </div>
      </Drawer>

      {/* 記錄列表 */}
      <div style={{ marginBottom: 12 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          共找到 <Typography.Text strong>{filteredRecords.length}</Typography.Text> 筆記錄
        </Typography.Text>
      </div>

      {filteredRecords.length === 0 ? (
        <Empty
          description={searchText || Object.values(filters).some(arr => arr.length > 0) ? "無符合條件的記錄" : "尚無保養記錄"}
          style={{ paddingTop: 40, paddingBottom: 40 }}
        />
      ) : (
        <List
          dataSource={filteredRecords}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'flex-start'
              }}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    width={100}
                    height={75}
                    src={item.thumb}
                    style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                    preview={true}
                  />
                }
                title={
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Typography.Text strong>
                        {item.date.split('-').slice(1).join('-')} | {item.floor} | {item.location}
                      </Typography.Text>
                    </div>
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        維運系統：{item.system}
                      </Typography.Text>
                    </div>
                  </div>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        保養人員：{item.staff}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        照片張數：{item.photos}
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
