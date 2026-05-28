import User from '../models/userModel.js';

function getUserIdFromReq(req) {
  return req.user?.id ?? req.user?.sub;
}

function normalizeItemId(item) {
  return String(
    item?.id ??
      item?._id ??
      item?.tmdbId ??
      item?.imdbId ??
      item?.title ??
      Date.now(),
  );
}

export const getWatchlist = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);

    if (!userId) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const user = await User.findById(userId).select('watchlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ watchlist: user.watchlist || [] });
  } catch (err) {
    console.error('getWatchlist error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);

    if (!userId) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const item = req.body;
    if (!item) {
      return res.status(400).json({ error: 'Missing item in body' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.watchlist)) {
      user.watchlist = [];
    }

    const itemId = normalizeItemId(item);
    const existsIndex = user.watchlist.findIndex(
      (watchlistItem) => String(watchlistItem.id) === itemId,
    );

    if (existsIndex !== -1) {
      user.watchlist.splice(existsIndex, 1);
      await user.save();
      return res.json({ action: 'removed', watchlist: user.watchlist });
    }

    const newItem = Object.assign({}, item, { id: itemId });
    user.watchlist.push(newItem);
    await user.save();

    return res.json({ action: 'added', watchlist: user.watchlist });
  } catch (err) {
    console.error('toggleWatchlist error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
