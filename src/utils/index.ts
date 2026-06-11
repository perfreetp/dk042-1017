export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatDateTime = (dateStr: string, timeStr: string): string => {
  return `${formatDate(dateStr)} ${timeStr}`;
};

export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    recruiting: '报名中',
    ongoing: '进行中',
    ended: '已结束',
    upcoming: '待上课',
    completed: '已完成',
    cancelled: '已取消',
    waitlist: '候补中',
    pending: '审核中',
    approved: '已通过',
    rejected: '未通过'
  };
  return map[status] || status;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    recruiting: '#00B42A',
    ongoing: '#165DFF',
    ended: '#86909C',
    upcoming: '#FF7D00',
    completed: '#00B42A',
    cancelled: '#F53F3F',
    waitlist: '#FF6B35',
    pending: '#FF7D00',
    approved: '#00B42A',
    rejected: '#F53F3F'
  };
  return map[status] || '#86909C';
};
