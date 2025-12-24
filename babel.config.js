
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src', // @ trỏ tới src
          '@components': './src/components/', // nếu muốn import trực tiếp
        },
      },
    ],
  ],
};
