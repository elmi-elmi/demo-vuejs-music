import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
  test('render song.display_name', () => {
    const song = {
      display_name: 'Shahroookh',
    };
    const wrapper = shallowMount(SongItem, {
      propsDate: {
        song,
      },
      global: { components: { 'router-link': RouterLinkStub } },
    });
    expect(wrapper.text()).toContain(song.display_name);
  });
});
