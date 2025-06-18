import { useState, useEffect } from 'react';
import type { Contestant, Icon } from '../types';
import { createParticles } from '../utils/particleUtils';
import { TOTAL_ICONS, mockContestants, MOCK_CURRENT_QUESTION } from '../constants';

export const useEliminate = () => {
  const [contestants, setContestants] = useState<Contestant[]>(mockContestants);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [recentlyRestored, setRecentlyRestored] = useState<number[]>([]);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [fadingOutContestants, setFadingOutContestants] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<'eliminated' | 'rescued'>('eliminated');

  // Initialize and update icons based on contestants
  useEffect(() => {
    console.log('Contestants data:', contestants);
    const newIcons: Icon[] = Array.from({ length: Math.max(TOTAL_ICONS, contestants.length) }, (_, index) => {
      const contestant = contestants.find(c => c.registration_number === (index + 1));
      return {
        id: index + 1,
        registrationNumber: contestant?.registration_number || index + 1,
        name: contestant?.fullname || '',
        isDisintegrated: contestant ? !['Đang thi', 'Qua vòng', 'Xác nhận 1', 'Xác nhận 2', 'Được cứu'].includes(contestant.match_status) : true,
        isRescued: contestant ? contestant.match_status === 'Được cứu' : false,
        particles: [],
        isFading: false,
        isActive: !!contestant,
      };
    });
    setIcons(newIcons);
  }, [contestants]);

  // Automatically switch display mode based on rescued contestants
  useEffect(() => {
    const hasRescuedContestants = contestants.some(c => c.match_status === 'Được cứu');
    setDisplayMode(hasRescuedContestants ? 'rescued' : 'eliminated');
  }, [contestants]);

  // Handle snap action
  const handleSnap = (action: 'delete' | 'restore') => {
    if (actionInProgress) return;
    setActionInProgress(true);

    if (action === 'delete') {
      setRecentlyRestored([]);
      const activeIcons = icons.filter(icon => !icon.isDisintegrated && icon.isActive);
      if (activeIcons.length > 0) {
        const deleteList = activeIcons
          .filter(() => Math.random() > 0.5)
          .map(icon => icon.registrationNumber);
        if (deleteList.length === 0) {
          setActionInProgress(false);
          return;
        }
        setContestants(prev =>
          prev.map(c =>
            deleteList.includes(c.registration_number)
              ? { ...c, match_status: 'Bị loại', eliminated_at_question_order: MOCK_CURRENT_QUESTION }
              : c
          )
        );
        setIcons(prevIcons =>
          prevIcons.map(icon =>
            deleteList.includes(icon.registrationNumber) ? { ...icon, isFading: true } : icon
          )
        );
        setTimeout(() => {
          setIcons(prevIcons =>
            prevIcons.map(icon =>
              deleteList.includes(icon.registrationNumber)
                ? { ...icon, isDisintegrated: true, isFading: false, particles: createParticles(icon.registrationNumber) }
                : icon
            )
          );
          setTimeout(() => {
            setIcons(prevIcons =>
              prevIcons.map(icon =>
                deleteList.includes(icon.registrationNumber) ? { ...icon, particles: [] } : icon
              )
            );
            setActionInProgress(false);
          }, 1000);
        }, 1000);
      } else {
        setActionInProgress(false);
      }
    } else if (action === 'restore') {
      const disintegratedIcons = icons
        .filter(icon => icon.isDisintegrated && icon.isActive)
        .map(icon => icon.registrationNumber);
      if (disintegratedIcons.length > 0) {
        setContestants(prev =>
          prev.map(c =>
            disintegratedIcons.includes(c.registration_number)
              ? { ...c, match_status: 'Được cứu', eliminated_at_question_order: null }
              : c
          )
        );
        setFadingOutContestants(disintegratedIcons);
        setTimeout(() => {
          setRecentlyRestored(disintegratedIcons);
          setFadingOutContestants([]);
          setIcons(prevIcons =>
            prevIcons.map(icon => {
              if (disintegratedIcons.includes(icon.registrationNumber)) {
                return { ...icon, isDisintegrated: false, isFading: false, particles: [] };
              }
              return icon;
            })
          );
          setTimeout(() => {
            setActionInProgress(false);
          }, 800);
        }, 1000);
      } else {
        setActionInProgress(false);
      }
    }
  };

  const activeIconCount = icons.filter(icon => !icon.isDisintegrated && icon.isActive).length;
  const canDelete = activeIconCount > 0 && !actionInProgress;
  const canRestore = icons.some(icon => icon.isDisintegrated && icon.isActive) && !actionInProgress;

  return {
    contestants,
    icons,
    recentlyRestored,
    actionInProgress,
    fadingOutContestants,
    displayMode,
    setDisplayMode,
    handleSnap,
    canDelete,
    canRestore,
  };
};